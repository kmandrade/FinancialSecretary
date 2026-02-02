import type { Router } from '../lib/router';
import { jsonResponse, parseJson } from '../lib/http';
import { z } from 'zod';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationService } from '../services/notification.service';
import { requireUser } from './_helpers';

const UpsertDeviceSchema = z.object({
  id: z.string().optional(),
  apelido_dispositivo: z.string().max(60).optional(),
  plataforma: z.enum(['web', 'android', 'ios']).optional(),
  user_agent: z.string().optional()
});

const SubscribeSchema = z.object({
  dispositivo_id: z.string().min(1),
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth: z.string().min(1)
    })
  })
});

const PermissionSchema = z.object({
  dispositivo_id: z.string().optional(),
  estado: z.enum(['CONCEDIDA', 'NEGADA', 'BLOQUEADA', 'PADRAO']),
  origem: z.enum(['POPUP_NAVEGADOR', 'TELA_CONFIG_APP', 'CONFIG_SISTEMA', 'DESCONHECIDA']),
  detalhes: z.string().optional()
});

const RevokeSchema = z.object({
  subscription_id: z.string().min(1)
});

export function registerNotificationsController(router: Router) {
  router.get('/api/v1/notifications/devices', async (ctx) => {
    const user = requireUser(ctx);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const devices = await service.listDevices(user.id);
    return jsonResponse({ devices });
  });

  router.post('/api/v1/notifications/device', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, UpsertDeviceSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const device = await service.upsertDevice({
      usuario_id: user.id,
      id: body.id,
      apelido_dispositivo: body.apelido_dispositivo,
      plataforma: body.plataforma,
      user_agent: body.user_agent
    });
    return jsonResponse({ device },  { status: 201 });
  });

  router.post('/api/v1/notifications/push/subscribe', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, SubscribeSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const subscription = await service.upsertPushSubscription({
      usuario_id: user.id,
      dispositivo_id: body.dispositivo_id,
      subscription: body.subscription
    });
    return jsonResponse({ subscription }, { status: 201 });
  });

  router.post('/api/v1/notifications/push/revoke', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, RevokeSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    await service.revokeSubscriptionById({ usuario_id: user.id, subscription_id: body.subscription_id });
    return jsonResponse({ ok: true });
  });

  router.post('/api/v1/notifications/push/permission', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, PermissionSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const permission = await service.recordPermission({
      usuario_id: user.id,
      dispositivo_id: body.dispositivo_id,
      estado: body.estado,
      origem: body.origem,
      detalhes: body.detalhes
    });
    return jsonResponse({ permission }, { status: 201 });
  });

  router.get('/api/v1/notifications/messages', async (ctx) => {
    const user = requireUser(ctx);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const messages = await service.listMessages(user.id, 50);
    return jsonResponse({ messages });
  });
}
