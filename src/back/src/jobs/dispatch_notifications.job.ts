import type { Env } from '../types/env';
import { NotificationRepository, type NotificationMessageRow } from '../repositories/notification.repository';
import { UserRepository } from '../repositories/user.repository';
import { DigestRepository } from '../repositories/digest.repository';
import { JobRepository } from '../repositories/job.repository';
import { PushService } from '../services/push.service';
import { EmailService } from '../services/email.service';

function extractDigestId(deepLink?: string | null): string | null {
  if (!deepLink) return null;
  if (!deepLink.startsWith('digest:')) return null;
  return deepLink.slice('digest:'.length) || null;
}

function toEmailHtml(title: string, body: string | null | undefined): string {
  const safeBody = (body ?? '').replace(/\n/g, '<br/>');
  return `<h2>${title}</h2><p>${safeBody}</p>`;
}

async function trySendPush(
  push: PushService,
  notifRepo: NotificationRepository,
  msg: NotificationMessageRow
): Promise<{ sent: boolean; reason?: string }> {
  const subs = await notifRepo.listValidSubscriptionsByUser(msg.usuario_id);
  if (subs.length === 0) return { sent: false, reason: 'no_push_subscription' };

  let ok = 0;
  for (const s of subs) {
    try {
      await push.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth }
        },
        {
          title: msg.titulo,
          body: msg.corpo ?? undefined,
          url: msg.deep_link ?? undefined
        }
      );
      ok += 1;
    } catch (e: any) {
      const status = e?.statusCode ?? e?.status;
      if (status === 404 || status === 410) {
        await notifRepo.invalidateSubscription(s.id);
      }
    }
  }

  if (ok > 0) return { sent: true };
  return { sent: false, reason: 'push_failed' };
}

async function trySendEmail(env: Env, emailSvc: EmailService, userRepo: UserRepository, msg: NotificationMessageRow): Promise<{ sent: boolean; reason?: string }> {
  const u = await userRepo.getById(msg.usuario_id);
  if (!u?.email) return { sent: false, reason: 'no_email' };

  try {
    const res = await emailSvc.sendNotificationEmail({
      to: u.email,
      subject: msg.titulo,
      html: toEmailHtml(msg.titulo, msg.corpo),
      text: msg.corpo ?? undefined
    });

    if (res?.skipped) return { sent: false, reason: 'email_not_configured' };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: 'email_failed' };
  }
}

export async function runDispatchNotifications(
  env: Env,
  meta?: { cron?: string; limit?: number }
): Promise<{ processed: number; sent: number; failed: number; ignored: number }> {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution('DISPARO_NOTIFICACOES', { cron: meta?.cron ?? null, limit: meta?.limit ?? null });

  const notifRepo = new NotificationRepository(env.DB);
  const userRepo = new UserRepository(env.DB);
  const digestRepo = new DigestRepository(env.DB);

  const push = new PushService(env);
  const emailSvc = new EmailService(env);

  const limit = meta?.limit ?? 100;
  const pending = await notifRepo.listPendingMessages(limit);

  let processed = 0;
  let sent = 0;
  let failed = 0;
  let ignored = 0;

  for (const msg of pending) {
    processed += 1;

    try {
      if (msg.canal === 'PUSH') {
        const r = await trySendPush(push, notifRepo, msg);

        if (r.sent) {
          await notifRepo.markMessageSent(msg.id);
          sent += 1;

          const d = extractDigestId(msg.deep_link);
          if (d) await digestRepo.markDigestSent(d);
        } else {
          await notifRepo.markMessageIgnored(msg.id, r.reason ?? 'push_not_sent');
          ignored += 1;

          // fallback email
          const fallbackId = crypto.randomUUID();
          await notifRepo.createMessage({
            id: fallbackId,
            usuario_id: msg.usuario_id,
            tipo: msg.tipo,
            canal: 'EMAIL',
            titulo: msg.titulo,
            corpo: msg.corpo,
            deep_link: msg.deep_link
          });
        }
      } else {
        const r = await trySendEmail(env, emailSvc, userRepo, msg);

        if (r.sent) {
          await notifRepo.markMessageSent(msg.id);
          sent += 1;

          const d = extractDigestId(msg.deep_link);
          if (d) await digestRepo.markDigestSent(d);
        } else if (r.reason === 'email_not_configured') {
          await notifRepo.markMessageIgnored(msg.id, 'email_not_configured');
          ignored += 1;
        } else {
          await notifRepo.markMessageFailed(msg.id, r.reason ?? 'email_failed');
          failed += 1;
        }
      }
    } catch (e: any) {
      failed += 1;
      await notifRepo.markMessageFailed(msg.id, e?.message ?? 'dispatch_failed');
      await jobRepo.logError({ tipo_job: 'DISPARO_NOTIFICACOES', usuario_id: msg.usuario_id, mensagem: e?.message ?? 'Erro disparando', stack: e?.stack });
    }
  }

  await jobRepo.finishExecution(execId, failed === 0 ? 'SUCESSO' : 'PARCIAL', {
    qtdProcessada: processed,
    qtdErros: failed,
    detalhes: { sent, ignored }
  });

  return { processed, sent, failed, ignored };
}
