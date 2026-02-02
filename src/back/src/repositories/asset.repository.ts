import type { Env } from '../types/env';

export type DbAsset = {
  id: string;
  ticker: string;
  nome_curto: string | null;
  tipo: 'ACAO' | 'FII' | 'CRIPTO';
  bolsa: string | null;
  ativo: number;
  criado_em: string;
  atualizado_em: string;
};

export type DbQuote = {
  id: string;
  ativo_id: string;
  preco: number;
  cotado_em: string;
  buscado_em: string;
  fonte: string | null;
};

export class AssetRepository {
  constructor(private env: Env) { }

  // Aliases para manter serviços/controllers simples
  async searchByTickerOrName(query: string, limit = 25) {
    return this.search(query, limit);
  }

  async getLatestQuoteByAssetId(assetId: string) {
    return this.getLatestQuote(assetId);
  }

  async updateNameShort(assetId: string, nameShort: string | null) {
    await this.env.DB
      .prepare(
        `UPDATE ativos
            SET nome_curto = ?, atualizado_em = datetime('now')
          WHERE id = ?`
      )
      .bind(nameShort, assetId)
      .run();
  }

  async createAsset(asset: {
    id?: string; // (recomendo deixar opcional)
    ticker: string;
    nome_curto?: string | null;
    tipo: 'ACAO' | 'FII' | 'CRIPTO';
    bolsa?: string | null;
  }): Promise<DbAsset> {
    return this.upsertAsset({
      id: asset.id,
      ticker: asset.ticker,
      nome_curto: asset.nome_curto ?? null,
      tipo: asset.tipo,
      bolsa: asset.bolsa ?? null,
    });
  }


  async search(query: string, limit = 20): Promise<DbAsset[]> {
    const q = `%${query.toUpperCase()}%`;
    const res = await this.env.DB
      .prepare(
        `SELECT * FROM ativos
         WHERE ativo = 1 AND (UPPER(ticker) LIKE ? OR UPPER(COALESCE(nome_curto,'')) LIKE ?)
         ORDER BY ticker
         LIMIT ?`
      )
      .bind(q, q, limit)
      .all<DbAsset>();
    return res.results;
  }

  async getByTicker(ticker: string): Promise<DbAsset | null> {
    const a = await this.env.DB
      .prepare(`SELECT * FROM ativos WHERE UPPER(ticker) = UPPER(?) AND ativo = 1 LIMIT 1`)
      .bind(ticker)
      .first<DbAsset>();
    return a ?? null;
  }

  async getById(id: string): Promise<DbAsset | null> {
    const a = await this.env.DB
      .prepare(`SELECT * FROM ativos WHERE id = ? AND ativo = 1 LIMIT 1`)
      .bind(id)
      .first<DbAsset>();
    return a ?? null;
  }

  async upsertAsset(asset: { id?: string; ticker: string; nome_curto?: string | null; tipo: DbAsset['tipo']; bolsa?: string | null }) {
    const id = asset.id ?? crypto.randomUUID();
    await this.env.DB
      .prepare(
        `INSERT INTO ativos (id, ticker, nome_curto, tipo, bolsa, ativo)
         VALUES (?, ?, ?, ?, ?, 1)
         ON CONFLICT(ticker) DO UPDATE SET
           nome_curto = COALESCE(excluded.nome_curto, ativos.nome_curto),
           tipo = excluded.tipo,
           bolsa = COALESCE(excluded.bolsa, ativos.bolsa),
           ativo = 1,
           atualizado_em = datetime('now')`
      )
      .bind(id, asset.ticker.toUpperCase(), asset.nome_curto ?? null, asset.tipo, asset.bolsa ?? null)
      .run();

    const row = await this.getByTicker(asset.ticker);
    if (!row) throw new Error('Failed to upsert asset');
    return row;
  }

  async insertQuote(quote: { id?: string; ativo_id: string; preco: number; cotado_em: string; fonte?: string | null }) {
    await this.env.DB
      .prepare(`INSERT INTO cotacoes (id, ativo_id, preco, cotado_em, fonte) VALUES (?, ?, ?, ?, ?)`)
      .bind(quote.id ?? crypto.randomUUID(), quote.ativo_id, quote.preco, quote.cotado_em, quote.fonte ?? null)
      .run();
  }

  async getLatestQuote(assetId: string): Promise<DbQuote | null> {
    const q = await this.env.DB
      .prepare(
        `SELECT * FROM cotacoes
         WHERE ativo_id = ?
         ORDER BY datetime(buscado_em) DESC
         LIMIT 1`
      )
      .bind(assetId)
      .first<DbQuote>();
    return q ?? null;
  }

  async getLatestQuotes(assetIds: string[]): Promise<Record<string, DbQuote>> {
    if (assetIds.length === 0) return {};
    const placeholders = assetIds.map(() => '?').join(',');
    const sql =
      `SELECT c.*
       FROM cotacoes c
       JOIN (
         SELECT ativo_id, MAX(datetime(buscado_em)) AS max_buscado
         FROM cotacoes
         WHERE ativo_id IN (${placeholders})
         GROUP BY ativo_id
       ) t ON t.ativo_id = c.ativo_id AND datetime(c.buscado_em) = t.max_buscado`;

    const res = await this.env.DB.prepare(sql).bind(...assetIds).all<DbQuote>();
    const map: Record<string, DbQuote> = {};
    for (const row of res.results) map[row.ativo_id] = row;
    return map;
  }
}
