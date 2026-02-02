import type { D1Database } from '@cloudflare/workers-types';

export type PasswordResetTokenRow = {
  id: string;
  usuario_id: string;
  token: string;
  expira_em: string;
  usado_em: string | null;
  criado_em: string;
};

export class PasswordResetRepository {
  constructor(private db: D1Database) {}

  async create(userId: string, opts?: { expiresMinutes?: number }) {
    const id = crypto.randomUUID();
    const token = crypto.randomUUID();
    const expiresMinutes = opts?.expiresMinutes ?? 60;
    const expira_em = new Date(Date.now() + expiresMinutes * 60_000).toISOString();
    await this.db
      .prepare(`INSERT INTO tokens_reset_senha (id, usuario_id, token, expira_em) VALUES (?1, ?2, ?3, ?4)`)
      .bind(id, userId, token, expira_em)
      .run();
    return { id, token, expira_em };
  }

  async getValidByToken(token: string): Promise<PasswordResetTokenRow | null> {
    const row = await this.db
      .prepare(`
        SELECT id, usuario_id, token, expira_em, usado_em, criado_em
          FROM tokens_reset_senha
         WHERE token = ?1
           AND usado_em IS NULL
           AND expira_em > datetime('now')
         LIMIT 1
      `)
      .bind(token)
      .first<PasswordResetTokenRow>();
    return row ?? null;
  }

  async markUsed(id: string): Promise<void> {
    await this.db
      .prepare(`UPDATE tokens_reset_senha SET usado_em = datetime('now') WHERE id = ?1`)
      .bind(id)
      .run();
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.db
      .prepare(`UPDATE tokens_reset_senha SET usado_em = datetime('now') WHERE usuario_id = ?1 AND usado_em IS NULL`)
      .bind(userId)
      .run();
  }
}
