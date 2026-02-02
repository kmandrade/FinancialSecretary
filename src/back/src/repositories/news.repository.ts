import type { D1Database } from '@cloudflare/workers-types';

export type NewsRow = {
  id: string;
  url: string;
  fonte: string | null;
  titulo: string;
  trecho: string | null;
  publicado_em: string | null;
  buscado_em: string;
  hash_dedupe: string;
  resumo_bruto: string | null;
};

export type AssetNewsRow = {
  ativo_id: string;
  noticia_id: string;
};

export class NewsRepository {
  constructor(private db: D1Database) {}

  async upsertNews(news: {
    url: string;
    fonte?: string | null;
    titulo: string;
    trecho?: string | null;
    publicado_em?: string | null;
    hash_dedupe: string;
  }) {
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `
        INSERT INTO noticias (id, url, fonte, titulo, trecho, publicado_em, hash_dedupe)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(url) DO UPDATE SET
          fonte = COALESCE(excluded.fonte, noticias.fonte),
          titulo = excluded.titulo,
          trecho = COALESCE(excluded.trecho, noticias.trecho),
          publicado_em = COALESCE(excluded.publicado_em, noticias.publicado_em),
          hash_dedupe = COALESCE(excluded.hash_dedupe, noticias.hash_dedupe)
        `
      )
      .bind(id, news.url, news.fonte ?? null, news.titulo, news.trecho ?? null, news.publicado_em ?? null, news.hash_dedupe)
      .run();

    const row = await this.db.prepare(`SELECT * FROM noticias WHERE url = ? LIMIT 1`).bind(news.url).first<NewsRow>();
    if (!row) throw new Error('Failed to upsert news');
    return row;
  }

  async linkNewsToAsset(noticiaId: string, assetId: string) {
    await this.db
      .prepare(`INSERT OR IGNORE INTO noticias_ativos (id, noticia_id, ativo_id) VALUES (?, ?, ?)`)
      .bind(crypto.randomUUID(), noticiaId, assetId)
      .run();
  }

  async listNewsForAsset(assetId: string, limit: number = 20) {
    const rs = await this.db
      .prepare(
        `
        SELECT n.*
          FROM noticias_ativos na
          JOIN noticias n ON n.id = na.noticia_id
         WHERE na.ativo_id = ?
         ORDER BY datetime(COALESCE(n.publicado_em, n.buscado_em)) DESC
         LIMIT ?
        `
      )
      .bind(assetId, limit)
      .all<NewsRow>();

    return rs.results;
  }

  async listNewsForUserWatchlist(userId: string, sinceHours: number, limit: number = 50) {
    const rs = await this.db
      .prepare(
        `
        SELECT DISTINCT n.*
          FROM itens_watchlist w
          JOIN noticias_ativos na ON na.ativo_id = w.ativo_id
          JOIN noticias n ON n.id = na.noticia_id
         WHERE w.usuario_id = ? AND w.ativo = 1
           AND datetime(COALESCE(n.publicado_em, n.buscado_em)) >= datetime('now', '-' || ? || ' hours')
         ORDER BY datetime(COALESCE(n.publicado_em, n.buscado_em)) DESC
         LIMIT ?
        `
      )
      .bind(userId, String(sinceHours), limit)
      .all<NewsRow>();

    return rs.results;
  }
}
