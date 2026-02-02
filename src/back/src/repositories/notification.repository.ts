import type { D1Database } from '@cloudflare/workers-types';

export type NotificationChannel = 'PUSH' | 'EMAIL';
export type NotificationType = 'ALERTA_PRECO' | 'RESUMO_DIARIO' | 'AVISO_SISTEMA';
export type NotificationStatus = 'PENDENTE' | 'ENVIADA' | 'FALHOU' | 'IGNORADA';

export type NotificationPermissionState = 'CONCEDIDA' | 'NEGADA' | 'BLOQUEADA' | 'PADRAO';
export type NotificationPermissionOrigin =
  | 'POPUP_NAVEGADOR'
  | 'TELA_CONFIG_APP'
  | 'CONFIG_SISTEMA'
  | 'DESCONHECIDA';

export interface DeviceRow {
  id: string;
  usuario_id: string;
  apelido_dispositivo: string | null;
  plataforma: string | null;
  user_agent: string | null;
  visto_por_ultimo_em: string | null;
  ativo: number;
  criado_em: string;
  atualizado_em: string;
}

export interface PushSubscriptionRow {
  id: string;
  usuario_id: string;
  dispositivo_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  valida: number;
  criado_em: string;
  revogado_em: string | null;
}

export interface NotificationMessageRow {
  id: string;
  usuario_id: string;
  tipo: NotificationType;
  canal: NotificationChannel;
  titulo: string;
  corpo: string | null;
  deep_link: string | null;
  status: NotificationStatus;
  id_provedor: string | null;
  erro: string | null;
  criado_em: string;
  enviado_em: string | null;
}

export interface PermissionHistoryRow {
  id: string;
  usuario_id: string;
  dispositivo_id: string | null;
  estado: NotificationPermissionState;
  origem: NotificationPermissionOrigin;
  ocorrido_em: string;
  detalhes: string | null;
}

export class NotificationRepository {
  constructor(private readonly db: D1Database) {}

  async upsertDevice(input: {
    id?: string;
    usuario_id: string;
    apelido_dispositivo?: string | null;
    plataforma?: string | null;
    user_agent?: string | null;
  }): Promise<DeviceRow> {
    const now = new Date().toISOString();

    if (input.id) {
      const update = await this.db
        .prepare(
          `UPDATE dispositivos_usuario
             SET apelido_dispositivo = ?,
                 plataforma = ?,
                 user_agent = ?,
                 visto_por_ultimo_em = ?,
                 ativo = 1,
                 atualizado_em = datetime('now')
           WHERE id = ? AND usuario_id = ?`
        )
        .bind(
          input.apelido_dispositivo ?? null,
          input.plataforma ?? null,
          input.user_agent ?? null,
          now,
          input.id,
          input.usuario_id
        )
        .run();

      if (update.success && (update.meta.changes ?? 0) > 0) {
        const row = await this.getDeviceById(input.id, input.usuario_id);
        if (row) return row;
      }
    }

    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO dispositivos_usuario (id, usuario_id, apelido_dispositivo, plataforma, user_agent, visto_por_ultimo_em, ativo)
         VALUES (?, ?, ?, ?, ?, ?, 1)`
      )
      .bind(
        id,
        input.usuario_id,
        input.apelido_dispositivo ?? null,
        input.plataforma ?? null,
        input.user_agent ?? null,
        now
      )
      .run();

    const created = await this.getDeviceById(id, input.usuario_id);
    if (!created) throw new Error('Falha ao criar dispositivo');
    return created;
  }

  async getDeviceById(id: string, usuarioId: string): Promise<DeviceRow | null> {
    const res = await this.db
      .prepare(
        `SELECT * FROM dispositivos_usuario
         WHERE id = ? AND usuario_id = ?`
      )
      .bind(id, usuarioId)
      .first<DeviceRow>();
    return res ?? null;
  }

  async listDevicesByUser(usuarioId: string): Promise<DeviceRow[]> {
    const res = await this.db
      .prepare(
        `SELECT * FROM dispositivos_usuario
         WHERE usuario_id = ?
         ORDER BY atualizado_em DESC`
      )
      .bind(usuarioId)
      .all<DeviceRow>();
    return res.results ?? [];
  }

  async upsertPushSubscription(input: {
    usuario_id: string;
    dispositivo_id: string;
    endpoint: string;
    p256dh: string;
    auth: string;
  }): Promise<PushSubscriptionRow> {
    const id = crypto.randomUUID();

    await this.db
      .prepare(
        `INSERT INTO inscricoes_push (id, usuario_id, dispositivo_id, endpoint, p256dh, auth, valida)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON CONFLICT(dispositivo_id, endpoint) DO UPDATE SET
           p256dh = excluded.p256dh,
           auth = excluded.auth,
           valida = 1,
           revogado_em = NULL`
      )
      .bind(id, input.usuario_id, input.dispositivo_id, input.endpoint, input.p256dh, input.auth)
      .run();

    const row = await this.db
      .prepare(
        `SELECT * FROM inscricoes_push
         WHERE usuario_id = ? AND dispositivo_id = ? AND endpoint = ?`
      )
      .bind(input.usuario_id, input.dispositivo_id, input.endpoint)
      .first<PushSubscriptionRow>();

    if (!row) throw new Error('Falha ao registrar inscricao push');
    return row;
  }

  async revokePushSubscription(input: {
    usuario_id: string;
    dispositivo_id: string;
    endpoint: string;
  }): Promise<void> {
    await this.db
      .prepare(
        `UPDATE inscricoes_push
           SET valida = 0,
               revogado_em = datetime('now')
         WHERE usuario_id = ? AND dispositivo_id = ? AND endpoint = ?`
      )
      .bind(input.usuario_id, input.dispositivo_id, input.endpoint)
      .run();
  }

  async listValidSubscriptionsByUser(usuarioId: string): Promise<PushSubscriptionRow[]> {
    const res = await this.db
      .prepare(
        `SELECT * FROM inscricoes_push
         WHERE usuario_id = ? AND valida = 1`
      )
      .bind(usuarioId)
      .all<PushSubscriptionRow>();
    return res.results ?? [];
  }

  async markSubscriptionInvalidByEndpoint(endpoint: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE inscricoes_push
           SET valida = 0,
               revogado_em = datetime('now')
         WHERE endpoint = ?`
      )
      .bind(endpoint)
      .run();
  }

  async recordPermissionHistory(input: {
    usuario_id: string;
    dispositivo_id?: string | null;
    estado: NotificationPermissionState;
    origem: NotificationPermissionOrigin;
    detalhes?: string | null;
  }): Promise<void> {
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO historico_permissao_notificacao (id, usuario_id, dispositivo_id, estado, origem, detalhes)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.usuario_id,
        input.dispositivo_id ?? null,
        input.estado,
        input.origem,
        input.detalhes ?? null
      )
      .run();
  }

  async createMessage(input: {
    usuario_id: string;
    tipo: NotificationType;
    canal: NotificationChannel;
    titulo: string;
    corpo?: string | null;
    deep_link?: string | null;
    status?: NotificationStatus;
  }): Promise<NotificationMessageRow> {
    const id = crypto.randomUUID();
    const status = input.status ?? 'PENDENTE';

    await this.db
      .prepare(
        `INSERT INTO mensagens_notificacao (id, usuario_id, tipo, canal, titulo, corpo, deep_link, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.usuario_id,
        input.tipo,
        input.canal,
        input.titulo,
        input.corpo ?? null,
        input.deep_link ?? null,
        status
      )
      .run();

    const row = await this.db
      .prepare('SELECT * FROM mensagens_notificacao WHERE id = ?')
      .bind(id)
      .first<NotificationMessageRow>();

    if (!row) throw new Error('Falha ao criar mensagem');
    return row;
  }

  async markMessageSent(id: string, providerId?: string | null): Promise<void> {
    await this.db
      .prepare(
        `UPDATE mensagens_notificacao
           SET status = 'ENVIADA',
               id_provedor = ?,
               erro = NULL,
               enviado_em = datetime('now')
         WHERE id = ?`
      )
      .bind(providerId ?? null, id)
      .run();
  }

  async markMessageFailed(id: string, error: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE mensagens_notificacao
           SET status = 'FALHOU',
               erro = ?,
               enviado_em = datetime('now')
         WHERE id = ?`
      )
      .bind(error, id)
      .run();
  }

  async markMessageIgnored(id: string, reason?: string | null): Promise<void> {
    await this.db
      .prepare(
        `UPDATE mensagens_notificacao
           SET status = 'IGNORADA',
               erro = ?
         WHERE id = ?`
      )
      .bind(reason ?? null, id)
      .run();
  }

  async listMessagesByUser(usuarioId: string, limit = 50): Promise<NotificationMessageRow[]> {
    const res = await this.db
      .prepare(
        `SELECT * FROM mensagens_notificacao
         WHERE usuario_id = ?
         ORDER BY criado_em DESC
         LIMIT ?`
      )
      .bind(usuarioId, limit)
      .all<NotificationMessageRow>();

    return res.results ?? [];
  }

  async getPushSubscriptionById(id: string, usuarioId: string): Promise<PushSubscriptionRow | null> {
    const row = await this.db
      .prepare(`SELECT * FROM inscricoes_push WHERE id = ? AND usuario_id = ? LIMIT 1`)
      .bind(id, usuarioId)
      .first<PushSubscriptionRow>();
    return row ?? null;
  }

  async revokePushSubscriptionById(usuarioId: string, subscriptionId: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE inscricoes_push
           SET valida = 0,
               revogado_em = datetime('now')
         WHERE id = ? AND usuario_id = ?`
      )
      .bind(subscriptionId, usuarioId)
      .run();
  }

  async listPendingMessages(limit = 100): Promise<NotificationMessageRow[]> {
    const res = await this.db
      .prepare(
        `SELECT * FROM mensagens_notificacao
         WHERE status = 'PENDENTE'
         ORDER BY datetime(criado_em) ASC
         LIMIT ?`
      )
      .bind(limit)
      .all<NotificationMessageRow>();

    return res.results ?? [];
  }
}
