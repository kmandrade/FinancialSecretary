import type { D1Database } from "@cloudflare/workers-types";

export type AlertRow = {
  id: string;
  usuario_id: string;
  ativo_id: string;
  condicao: 'ACIMA_OU_IGUAL' | 'ABAIXO_OU_IGUAL';
  preco_alvo: number;
  ativo: number;
  cooldown_minutos: number;
  ultimo_disparo_em: string | null;
  criado_em: string;
  atualizado_em: string;
  ticker?: string;
  nome_curto?: string | null;
  tipo?: 'ACAO' | 'FII' | 'CRIPTO';
};

export type AlertFireEventRow = {
  id: string;
  alerta_id: string;
  usuario_id: string;
  ativo_id: string;
  preco_observado: number;
  disparado_em: string;
  motivo: 'CONDICAO_ATINGIDA' | 'TESTE_MANUAL';
  ticker?: string;
};

export class AlertRepository {
  constructor(private db: D1Database) {}

  async countActiveByUserAndAsset(userId: string, assetId: string): Promise<number> {
    const row = await this.db
      .prepare(`SELECT COUNT(1) as cnt FROM alertas_preco WHERE usuario_id = ? AND ativo_id = ? AND ativo = 1`)
      .bind(userId, assetId)
      .first<{ cnt: number }>();

    return Number(row?.cnt ?? 0);
  }

  async listActiveForPolling(): Promise<AlertRow[]> {
    const rs = await this.db
      .prepare(`SELECT id, usuario_id, ativo_id, condicao, preco_alvo, ativo, cooldown_minutos, ultimo_disparo_em, criado_em, atualizado_em FROM alertas_preco WHERE ativo = 1`)
      .all<AlertRow>();
    return rs.results;
  }

  async listByUser(userId: string) {
    const rs = await this.db
      .prepare(
        `
        SELECT ap.id, ap.usuario_id, ap.ativo_id, ap.condicao, ap.preco_alvo, ap.ativo,
               ap.cooldown_minutos, ap.ultimo_disparo_em, ap.criado_em, ap.atualizado_em,
               a.ticker as ticker, a.nome_curto as nome_curto, a.tipo as tipo
          FROM alertas_preco ap
          JOIN ativos a ON a.id = ap.ativo_id
         WHERE ap.usuario_id = ?
         ORDER BY datetime(ap.criado_em) DESC
        `
      )
      .bind(userId)
      .all<AlertRow>();

    return rs.results;
  }

  async getById(userId: string, id: string) {
    return await this.db
      .prepare(
        `
        SELECT ap.id, ap.usuario_id, ap.ativo_id, ap.condicao, ap.preco_alvo, ap.ativo,
               ap.cooldown_minutos, ap.ultimo_disparo_em, ap.criado_em, ap.atualizado_em,
               a.ticker as ticker, a.nome_curto as nome_curto, a.tipo as tipo
          FROM alertas_preco ap
          JOIN ativos a ON a.id = ap.ativo_id
         WHERE ap.usuario_id = ? AND ap.id = ?
         LIMIT 1
        `
      )
      .bind(userId, id)
      .first<AlertRow>();
  }

  async create(input: {
    usuario_id: string;
    ativo_id: string;
    condicao: AlertRow['condicao'];
    preco_alvo: number;
    cooldown_minutos?: number;
  }) {
    const id = crypto.randomUUID();
    const cooldown = input.cooldown_minutos ?? 30;

    await this.db
      .prepare(
        `
        INSERT INTO alertas_preco (id, usuario_id, ativo_id, condicao, preco_alvo, ativo, cooldown_minutos)
        VALUES (?, ?, ?, ?, ?, 1, ?)
        `
      )
      .bind(id, input.usuario_id, input.ativo_id, input.condicao, input.preco_alvo, cooldown)
      .run();

    return id;
  }

  async update(userId: string, id: string, patch: Partial<Pick<AlertRow, 'condicao' | 'preco_alvo' | 'ativo' | 'cooldown_minutos'>>) {
    const keys: string[] = [];
    const values: any[] = [];

    if (patch.condicao) {
      keys.push('condicao = ?');
      values.push(patch.condicao);
    }

    if (patch.preco_alvo !== undefined) {
      keys.push('preco_alvo = ?');
      values.push(patch.preco_alvo);
    }

    if (patch.ativo !== undefined) {
      keys.push('ativo = ?');
      values.push(patch.ativo);
    }

    if (patch.cooldown_minutos !== undefined) {
      keys.push('cooldown_minutos = ?');
      values.push(patch.cooldown_minutos);
    }

    if (!keys.length) return;

    keys.push(`atualizado_em = datetime('now')`);

    await this.db
      .prepare(`UPDATE alertas_preco SET ${keys.join(', ')} WHERE usuario_id = ? AND id = ?`)
      .bind(...values, userId, id)
      .run();
  }

  async delete(userId: string, id: string) {
    await this.db.prepare(`DELETE FROM alertas_preco WHERE usuario_id = ? AND id = ?`).bind(userId, id).run();
  }

  async listActiveByAssetIds(assetIds: string[]) {
    if (!assetIds.length) return [] as AlertRow[];

    const placeholders = assetIds.map(() => '?').join(',');
    const rs = await this.db
      .prepare(
        `
        SELECT id, usuario_id, ativo_id, condicao, preco_alvo, ativo, cooldown_minutos, ultimo_disparo_em, criado_em, atualizado_em
          FROM alertas_preco
         WHERE ativo = 1 AND ativo_id IN (${placeholders})
        `
      )
      .bind(...assetIds)
      .all<AlertRow>();

    return rs.results;
  }

  async listDistinctActiveAssetIds() {
    const rs = await this.db
      .prepare(`SELECT DISTINCT ativo_id as ativo_id FROM alertas_preco WHERE ativo = 1`)
      .all<{ ativo_id: string }>();

    return rs.results.map((r) => r.ativo_id);
  }

  async markFired(alertId: string, firedAtIso: string) {
    await this.db
      .prepare(`UPDATE alertas_preco SET ultimo_disparo_em = ?, atualizado_em = datetime('now') WHERE id = ?`)
      .bind(firedAtIso, alertId)
      .run();
  }

  async createFireEvent(input: {
    alerta_id: string;
    usuario_id: string;
    ativo_id: string;
    preco_observado: number;
    motivo?: AlertFireEventRow['motivo'];
  }) {
    const id = crypto.randomUUID();
    const motivo = input.motivo ?? 'CONDICAO_ATINGIDA';

    await this.db
      .prepare(
        `
        INSERT INTO eventos_disparo_alerta (id, alerta_id, usuario_id, ativo_id, preco_observado, motivo)
        VALUES (?, ?, ?, ?, ?, ?)
        `
      )
      .bind(id, input.alerta_id, input.usuario_id, input.ativo_id, input.preco_observado, motivo)
      .run();

    return id;
  }

  async listHistoryByUser(userId: string, limit: number = 100) {
    const rs = await this.db
      .prepare(
        `
        SELECT e.id, e.alerta_id, e.usuario_id, e.ativo_id, e.preco_observado, e.disparado_em, e.motivo,
               a.ticker as ticker
          FROM eventos_disparo_alerta e
          JOIN ativos a ON a.id = e.ativo_id
         WHERE e.usuario_id = ?
         ORDER BY datetime(e.disparado_em) DESC
         LIMIT ?
        `
      )
      .bind(userId, limit)
      .all<AlertFireEventRow>();

    return rs.results;
  }
}
