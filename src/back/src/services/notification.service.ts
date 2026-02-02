import { AppError } from '../lib/errors';
import type { DeviceRow, NotificationMessageRow, PushSubscriptionRow, PermissionHistoryRow } from '../repositories/notification.repository';
import { NotificationRepository } from '../repositories/notification.repository';

export type WebPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export class NotificationService {
  constructor(private notifRepo: NotificationRepository) {}

  async upsertDevice(params: {
    usuario_id: string;
    id?: string;
    apelido_dispositivo?: string | null;
    plataforma?: string | null;
    user_agent?: string | null;
  }): Promise<DeviceRow> {
    return await this.notifRepo.upsertDevice(params);
  }

  async listDevices(usuarioId: string): Promise<DeviceRow[]> {
    return await this.notifRepo.listDevicesByUser(usuarioId);
  }

  async upsertPushSubscription(params: {
    usuario_id: string;
    dispositivo_id: string;
    subscription: WebPushSubscription;
  }): Promise<PushSubscriptionRow> {
    if (!params.subscription?.endpoint) {
      throw new AppError('subscription_invalida', 400, 'Subscription inválida.');
    }

    return await this.notifRepo.upsertPushSubscription({
      usuario_id: params.usuario_id,
      dispositivo_id: params.dispositivo_id,
      endpoint: params.subscription.endpoint,
      p256dh: params.subscription.keys.p256dh,
      auth: params.subscription.keys.auth
    });
  }

  async revokePushSubscription(params: { usuario_id: string; dispositivo_id: string; endpoint: string }): Promise<void> {
    await this.notifRepo.revokePushSubscription(params);
  }

  async recordPermission(params: {
    usuario_id: string;
    dispositivo_id?: string | null;
    estado: 'CONCEDIDA' | 'NEGADA' | 'BLOQUEADA' | 'PADRAO';
    origem: 'POPUP_NAVEGADOR' | 'TELA_CONFIG_APP' | 'CONFIG_SISTEMA' | 'DESCONHECIDA';
    detalhes?: string | null;
  }): Promise<PermissionHistoryRow> {
    return await this.notifRepo.recordPermissionHistory({
      ...params,
      dispositivo_id: params.dispositivo_id ?? null,
      detalhes: params.detalhes ?? null
    });
  }

  async listMessages(usuarioId: string, limit = 50): Promise<NotificationMessageRow[]> {
    return await this.notifRepo.listMessagesByUser(usuarioId, limit);
  }

  async revokeSubscriptionById(params: { usuario_id: string; subscription_id: string }): Promise<void> {
    const row = await this.notifRepo.getPushSubscriptionById(params.subscription_id, params.usuario_id);
    if (!row) {
      return;
    }

    await this.notifRepo.revokePushSubscriptionById(params.usuario_id, params.subscription_id);
  }
}
