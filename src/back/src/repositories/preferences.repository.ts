import type { D1Database } from '@cloudflare/workers-types';

export type DbPreferences = {
  id: string;
  usuario_id: string;
  fuso_horario: string;
  resumo_diario_ativo: number;
  horario_resumo: string;
  canal_padrao_noticias: 'PUSH' | 'EMAIL' | 'AMBOS';
  alerta_aviso_push_obrigatorio: number;
  criado_em: string;
  atualizado_em: string;
};

export class PreferencesRepository {
  constructor(private db: D1Database) {}

  async getByUserId(userId: string): Promise<DbPreferences | null> {
    const p = await this.db
      .prepare(`SELECT * FROM preferencias_usuario WHERE usuario_id = ? LIMIT 1`)
      .bind(userId)
      .first<DbPreferences>();
    return p ?? null;
  }

  async ensureDefaults(userId: string): Promise<void> {
    await this.db
      .prepare(`INSERT OR IGNORE INTO preferencias_usuario (id, usuario_id) VALUES (?, ?)`)
      .bind(crypto.randomUUID(), userId)
      .run();
  }

  async upsert(userId: string, changes: Partial<Pick<DbPreferences, 'fuso_horario' | 'resumo_diario_ativo' | 'horario_resumo' | 'canal_padrao_noticias' | 'alerta_aviso_push_obrigatorio'>>): Promise<void> {
    await this.ensureDefaults(userId);
    await this.update(userId, changes);
  }

  async update(
    userId: string,
    changes: Partial<Pick<DbPreferences, 'fuso_horario' | 'resumo_diario_ativo' | 'horario_resumo' | 'canal_padrao_noticias' | 'alerta_aviso_push_obrigatorio'>>
  ): Promise<void> {
    const fields: string[] = [];
    const binds: unknown[] = [];

    if (typeof changes.fuso_horario === 'string') {
      fields.push('fuso_horario = ?');
      binds.push(changes.fuso_horario);
    }
    if (typeof changes.resumo_diario_ativo === 'number') {
      fields.push('resumo_diario_ativo = ?');
      binds.push(changes.resumo_diario_ativo);
    }
    if (typeof changes.horario_resumo === 'string') {
      fields.push('horario_resumo = ?');
      binds.push(changes.horario_resumo);
    }
    if (typeof changes.canal_padrao_noticias === 'string') {
      fields.push('canal_padrao_noticias = ?');
      binds.push(changes.canal_padrao_noticias);
    }
    if (typeof changes.alerta_aviso_push_obrigatorio === 'number') {
      fields.push('alerta_aviso_push_obrigatorio = ?');
      binds.push(changes.alerta_aviso_push_obrigatorio);
    }

    if (fields.length === 0) return;

    await this.db
      .prepare(
        `UPDATE preferencias_usuario SET ${fields.join(', ')}, atualizado_em = datetime('now') WHERE usuario_id = ?`
      )
      .bind(...binds, userId)
      .run();
  }

  async listDailyDigestUsers(): Promise<Array<{ user_id: string; email: string; fuso_horario: string; horario_resumo: string; canal_padrao_noticias: "PUSH" | "EMAIL" | "AMBOS" }>> {
    const rows = await this.db
      .prepare(`
        SELECT u.id as user_id, u.email as email, p.fuso_horario as fuso_horario, p.horario_resumo as horario_resumo, p.canal_padrao_noticias as canal_padrao_noticias
        FROM usuarios u
        JOIN preferencias_usuario p ON p.usuario_id = u.id
        WHERE u.excluido_em IS NULL AND p.resumo_diario_ativo = 1
      `)
      .all<{ user_id: string; email: string; fuso_horario: string; horario_resumo: string; canal_padrao_noticias: "PUSH" | "EMAIL" | "AMBOS" }>();
    return rows.results ?? [];
  }

}
