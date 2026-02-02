import type { D1Database } from '@cloudflare/workers-types';

export type WatchlistItemRow = {
  id: string;
  usuario_id: string;
  ativo_id: string;
  ativo: number;
  criado_em: string;
  ticker: string;
  nome_curto: string | null;
  tipo: 'ACAO' | 'FII' | 'CRIPTO';
  bolsa: string | null;
};

export class WatchlistRepository {
  constructor(private db: D1Database) {}

  async countActiveByUser(userId: string): Promise<number> {
    const row = await this.db
      .prepare(`SELECT COUNT(1) as cnt FROM itens_watchlist WHERE usuario_id = ? AND ativo = 1`)
      .bind(userId)
      .first<{ cnt: number }>();

    return Number(row?.cnt ?? 0);
  }

  async isInWatchlist(userId: string, assetId: string): Promise<boolean> {
    const row = await this.db
      .prepare(`SELECT 1 as ok FROM itens_watchlist WHERE usuario_id = ? AND ativo_id = ? AND ativo = 1 LIMIT 1`)
      .bind(userId, assetId)
      .first<{ ok: number }>();
    return !!row;
  }

  async listByUser(userId: string): Promise<WatchlistItemRow[]> {
    const rs = await this.db
      .prepare(
        `
        SELECT w.id,
               w.usuario_id,
               w.ativo_id,
               w.ativo,
               w.criado_em,
               a.ticker,
               a.nome_curto,
               a.tipo,
               a.bolsa
          FROM itens_watchlist w
          JOIN ativos a ON a.id = w.ativo_id
         WHERE w.usuario_id = ?
           AND w.ativo = 1
           AND a.ativo = 1
         ORDER BY datetime(w.criado_em) DESC
        `
      )
      .bind(userId)
      .all<WatchlistItemRow>();

    return rs.results;
  }

  async listDistinctActiveAssetIds(): Promise<string[]> {
    const rs = await this.db
      .prepare(`SELECT DISTINCT ativo_id as id FROM itens_watchlist WHERE ativo = 1`)
      .all<{ id: string }>();

    return rs.results.map((r) => r.id);
  }

  async add(userId: string, assetId: string): Promise<string> {
    const existing = await this.db
      .prepare(`SELECT id, ativo FROM itens_watchlist WHERE usuario_id = ? AND ativo_id = ? LIMIT 1`)
      .bind(userId, assetId)
      .first<{ id: string; ativo: number }>();

    if (existing) {
      if (existing.ativo === 1) return existing.id;
      await this.db
        .prepare(`UPDATE itens_watchlist SET ativo = 1, criado_em = datetime('now') WHERE id = ?`)
        .bind(existing.id)
        .run();
      return existing.id;
    }

    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `
        INSERT INTO itens_watchlist (id, usuario_id, ativo_id, ativo)
        VALUES (?, ?, ?, 1)
        `
      )
      .bind(id, userId, assetId)
      .run();

    return id;
  }

  async remove(userId: string, assetId: string): Promise<void> {
    await this.db
      .prepare(`UPDATE itens_watchlist SET ativo = 0 WHERE usuario_id = ? AND ativo_id = ?`)
      .bind(userId, assetId)
      .run();
  }
}
