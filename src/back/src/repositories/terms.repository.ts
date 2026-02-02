import type { D1Database } from '@cloudflare/workers-types';

export type TermsAcceptanceRow = {
  id: string;
  usuario_id: string;
  versao_termos: string;
  aceito: number;
  aceito_em: string | null;
  ip: string | null;
  user_agent: string | null;
  observacoes: string | null;
  criado_em: string;
};

export class TermsRepository {
  constructor(private db: D1Database) {}

  async getLatestAcceptanceByUser(userId: string) {
    return await this.db
      .prepare(
        `
        SELECT * FROM aceites_termos
         WHERE usuario_id = ?
         ORDER BY datetime(criado_em) DESC
         LIMIT 1
        `
      )
      .bind(userId)
      .first<TermsAcceptanceRow>();
  }

  async recordAcceptance(
    userId: string,
    version: string,
    meta?: { ip?: string; userAgent?: string; observacoes?: string }
  ) {
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `
        INSERT INTO aceites_termos (id, usuario_id, versao_termos, aceito, aceito_em, ip, user_agent, observacoes)
        VALUES (?, ?, ?, 1, datetime('now'), ?, ?, ?)
        `
      )
      .bind(id, userId, version, meta?.ip || null, meta?.userAgent || null, meta?.observacoes || null)
      .run();
    return id;
  }
}
