import type { D1Database } from '@cloudflare/workers-types';

export interface FeatureFlagRow {
  id: string;
  chave: string;
  habilitada: number;
  escopo: 'GLOBAL' | 'USUARIO';
  descricao: string | null;
  motivo: string | null;
  alterado_por_usuario_id: string | null;
  alterado_em: string;
}

export class FeatureFlagsRepository {
  constructor(private readonly db: D1Database) {}

  async isEnabledGlobal(chave: string): Promise<boolean> {
    const row = await this.db
      .prepare(`SELECT habilitada FROM feature_flags WHERE chave = ? AND escopo = 'GLOBAL' LIMIT 1`)
      .bind(chave)
      .first<{ habilitada: number }>();
    if (!row) return true;
    return row.habilitada === 1;
  }

  async listGlobal(): Promise<FeatureFlagRow[]> {
    const { results } = await this.db
      .prepare(`SELECT * FROM feature_flags WHERE escopo = 'GLOBAL' ORDER BY chave`)
      .all<FeatureFlagRow>();
    return results;
  }
}
