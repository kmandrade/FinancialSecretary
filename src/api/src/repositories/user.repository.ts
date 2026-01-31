// Repository para operacoes de usuario no D1

import { Env } from '../types/env';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  plan: string;
  notifications_enabled: number;
  daily_summary_enabled: number;
  daily_summary_time: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

export interface UpdateUserData {
  name?: string;
  plan?: string;
  notificationsEnabled?: boolean;
  dailySummaryEnabled?: boolean;
  dailySummaryTime?: string;
}

export class UserRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<UserRow | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first<UserRow>();
    return result;
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first<UserRow>();
    return result;
  }

  async create(data: CreateUserData): Promise<UserRow> {
    const now = new Date().toISOString();
    
    await this.db
      .prepare(`
        INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(data.id, data.email, data.name, data.passwordHash, now, now)
      .run();

    const user = await this.findById(data.id);
    if (!user) {
      throw new Error('Falha ao criar usuario');
    }
    return user;
  }

  async update(id: string, data: UpdateUserData): Promise<UserRow | null> {
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.plan !== undefined) {
      updates.push('plan = ?');
      values.push(data.plan);
    }
    if (data.notificationsEnabled !== undefined) {
      updates.push('notifications_enabled = ?');
      values.push(data.notificationsEnabled ? 1 : 0);
    }
    if (data.dailySummaryEnabled !== undefined) {
      updates.push('daily_summary_enabled = ?');
      values.push(data.dailySummaryEnabled ? 1 : 0);
    }
    if (data.dailySummaryTime !== undefined) {
      updates.push('daily_summary_time = ?');
      values.push(data.dailySummaryTime);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await this.db
      .prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run();

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .prepare('DELETE FROM users WHERE id = ?')
      .bind(id)
      .run();
    return result.meta.changes > 0;
  }

  async count(): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as count FROM users')
      .first<{ count: number }>();
    return result?.count ?? 0;
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<UserRow[]> {
    const result = await this.db
      .prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all<UserRow>();
    return result.results;
  }
}

// Factory para criar repository
export function createUserRepository(env: Env): UserRepository {
  return new UserRepository(env.DB);
}
