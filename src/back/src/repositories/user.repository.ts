import type { D1Database } from '@cloudflare/workers-types';

export type UserProfile = 'USUARIO' | 'ADMIN';

export interface UserRow {
  id: string;
  email: string;
  hash_senha: string;
  nome: string;
  perfil: UserProfile;
  criado_em: string;
  atualizado_em: string;
  excluido_em: string | null;
}

export class UserRepository {
  constructor(private readonly db: D1Database) {}

  async getById(id: string): Promise<UserRow | null> {
    const row = await this.db
      .prepare(
        `SELECT id, email, hash_senha, nome, perfil, criado_em, atualizado_em, excluido_em
         FROM usuarios
         WHERE id = ?
         LIMIT 1`
      )
      .bind(id)
      .first<UserRow>();

    return row ?? null;
  }

  async getByEmail(email: string): Promise<UserRow | null> {
    const row = await this.db
      .prepare(
        `SELECT id, email, hash_senha, nome, perfil, criado_em, atualizado_em, excluido_em
         FROM usuarios
         WHERE lower(email) = lower(?)
           AND excluido_em IS NULL
         LIMIT 1`
      )
      .bind(email)
      .first<UserRow>();

    return row ?? null;
  }

  async createUser(params: {
    email: string;
    hash_senha: string;
    nome: string;
    perfil?: UserProfile;
  }): Promise<UserRow> {
    const id = crypto.randomUUID();
    const perfil: UserProfile = params.perfil ?? 'USUARIO';

    await this.db
      .prepare(
        `INSERT INTO usuarios (id, email, hash_senha, nome, perfil)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(id, params.email, params.hash_senha, params.nome, perfil)
      .run();

    const created = await this.getById(id);
    if (!created) throw new Error('Falha ao criar usuário');

    return created;
  }

  async updateName(userId: string, nome: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE usuarios
         SET nome = ?, atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
      )
      .bind(nome, userId)
      .run();
  }

  async updateEmail(userId: string, email: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE usuarios
         SET email = ?, atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
      )
      .bind(email, userId)
      .run();
  }

  async updatePassword(userId: string, newHash: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE usuarios
         SET hash_senha = ?, atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
      )
      .bind(newHash, userId)
      .run();
  }

  async softDelete(userId: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE usuarios
         SET excluido_em = datetime('now'), atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
      )
      .bind(userId)
      .run();
  }

}
