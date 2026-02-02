import type { Env } from '../types/env';
import { PreferencesRepository } from '../repositories/preferences.repository';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { NewsRepository } from '../repositories/news.repository';
import { DigestRepository } from '../repositories/digest.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { JobRepository } from '../repositories/job.repository';
import { OpenAIService } from '../services/openai.service';

function formatLocalDate(timeZone: string, now: Date): string {
  // en-CA returns YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
}

function formatLocalTime(timeZone: string, now: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  }).format(now);
  return parts;
}

export async function runDigestGeneration(
  env: Env,
  meta?: { cron?: string; force?: boolean }
): Promise<{ usersChecked: number; digestsCreated: number; errors: number }> {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution('GERAR_RESUMO', { cron: meta?.cron ?? null, force: meta?.force ?? false });

  const prefsRepo = new PreferencesRepository(env.DB);
  const watchRepo = new WatchlistRepository(env.DB);
  const newsRepo = new NewsRepository(env.DB);
  const digestRepo = new DigestRepository(env.DB);
  const notifRepo = new NotificationRepository(env.DB);
  const openai = new OpenAIService(env);

  const now = new Date();
  let usersChecked = 0;
  let digestsCreated = 0;
  let errors = 0;

  try {
    const users = await prefsRepo.listDailyDigestUsers();

    for (const u of users) {
      usersChecked += 1;

      try {
        const tz = u.fuso_horario || 'America/Sao_Paulo';
        const localDate = formatLocalDate(tz, now);
        const localTime = formatLocalTime(tz, now);

        const prefTime = (u.horario_resumo || '08:00').trim();

        if (!meta?.force) {
          if (prefTime.length >= 4 && localTime !== prefTime) continue;
        }

        const existing = await digestRepo.getDigestByUserAndDate(u.usuario_id, localDate);
        if (existing && existing.enviado_em) continue;

        const watchItems = await watchRepo.listByUser(u.usuario_id);
        const tickers = watchItems.map((w) => w.ticker).filter(Boolean);
        if (tickers.length === 0) continue;

        const news = await newsRepo.listNewsForUserWatchlist(u.usuario_id, 24, 30);

        let texto_resumo = '';
        let provedor_modelo: string | null = null;
        let nome_modelo: string | null = null;

        if (env.OPENAI_API_KEY && news.length > 0) {
          provedor_modelo = 'openai';
          nome_modelo = env.OPENAI_MODEL ?? 'unknown';

          const inputNews = news.slice(0, 12).map((n) => ({
            titulo: n.titulo,
            fonte: n.fonte,
            publicado_em: n.publicado_em,
            url: n.url
          }));

          const summary = await openai.summarizeDailyDigest({
            tickers,
            news: inputNews
          });

          const bullets = summary.bullets?.length ? summary.bullets.map((b) => `• ${b}`).join('\n') : '';
          texto_resumo = `${summary.summary}\n\n${bullets}`.trim();
        } else {
          const top = news.slice(0, 8);
          if (top.length === 0) {
            texto_resumo = `Sem notícias relevantes nas últimas 24h para: ${tickers.join(', ')}.`;
          } else {
            const lines = top.map((n) => `• ${n.titulo}${n.fonte ? ` (${n.fonte})` : ''}`);
            texto_resumo = `Principais notícias (últimas 24h) para: ${tickers.join(', ')}\n\n${lines.join('\n')}`;
          }
        }

        const digestId = existing?.id ?? crypto.randomUUID();

        await digestRepo.upsertDigest({
          id: digestId,
          usuario_id: u.usuario_id,
          data_resumo: localDate,
          provedor_modelo,
          nome_modelo,
          texto_resumo
        });

        const digestItems = news.slice(0, 10).map((n, idx) => ({
          id: crypto.randomUUID(),
          resumo_id: digestId,
          noticia_id: n.id,
          ativo_id: n.ativo_id ?? null,
          bullets: null,
          ordem: idx
        }));

        await digestRepo.replaceDigestItems(digestId, digestItems);

        const title = `Resumo diário (${localDate})`;
        const deepLink = `digest:${digestId}`;

        const canal = (u.canal_padrao_noticias || 'PUSH').toUpperCase();
        if (canal === 'EMAIL') {
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: 'RESUMO_DIARIO',
            canal: 'EMAIL',
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
        } else if (canal === 'AMBOS') {
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: 'RESUMO_DIARIO',
            canal: 'PUSH',
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: 'RESUMO_DIARIO',
            canal: 'EMAIL',
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
        } else {
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: 'RESUMO_DIARIO',
            canal: 'PUSH',
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
        }

        digestsCreated += 1;
      } catch (e: any) {
        errors += 1;
        await jobRepo.logError({
          tipo_job: 'GERAR_RESUMO',
          usuario_id: u.usuario_id,
          mensagem: e?.message ?? 'Erro gerando resumo',
          stack: e?.stack
        });
      }
    }

    await jobRepo.finishExecution(execId, errors === 0 ? 'SUCESSO' : 'PARCIAL', {
      qtdProcessada: digestsCreated,
      qtdErros: errors,
      detalhes: { usersChecked }
    });

    return { usersChecked, digestsCreated, errors };
  } catch (e: any) {
    await jobRepo.finishExecution(execId, 'FALHA', {
      qtdProcessada: digestsCreated,
      qtdErros: errors + 1,
      detalhes: { error: e?.message ?? 'unknown' }
    });
    throw e;
  }
}
