import type { D1Database } from '@cloudflare/workers-types';

export interface DailyDigestRow {
  id: string;
  usuario_id: string;
  data_resumo: string;
  provedor_modelo: string | null;
  nome_modelo: string | null;
  texto_resumo: string | null;
  criado_em: string;
  enviado_em: string | null;
}

export interface DailyDigestItemRow {
  id: string;
  resumo_id: string;
  noticia_id: string;
  ativo_id: string | null;
  bullets: string | null;
  ordem: number;
}

export class DigestRepository {
  constructor(private db: D1Database) {}

  async getLatestDigestForUser(usuarioId: string): Promise<DailyDigestRow | null> {
    const row = await this.db
      .prepare(
        `SELECT *
           FROM resumos_diarios
          WHERE usuario_id = ?
          ORDER BY data_resumo DESC
          LIMIT 1`
      )
      .bind(usuarioId)
      .first<DailyDigestRow>();

    return row ?? null;
  }

  async getDigestByUserAndDate(usuarioId: string, dataResumo: string): Promise<DailyDigestRow | null> {
    const row = await this.db
      .prepare(
        `SELECT *
           FROM resumos_diarios
          WHERE usuario_id = ? AND data_resumo = ?
          LIMIT 1`
      )
      .bind(usuarioId, dataResumo)
      .first<DailyDigestRow>();

    return row ?? null;
  }

  async upsertDigest(params: {
    id: string;
    usuario_id: string;
    data_resumo: string;
    provedor_modelo?: string | null;
    nome_modelo?: string | null;
    texto_resumo?: string | null;
  }): Promise<void> {
    const { id, usuario_id, data_resumo, provedor_modelo, nome_modelo, texto_resumo } = params;

    await this.db
      .prepare(
        `INSERT INTO resumos_diarios (id, usuario_id, data_resumo, provedor_modelo, nome_modelo, texto_resumo)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(usuario_id, data_resumo) DO UPDATE SET
           provedor_modelo = excluded.provedor_modelo,
           nome_modelo = excluded.nome_modelo,
           texto_resumo = excluded.texto_resumo`
      )
      .bind(id, usuario_id, data_resumo, provedor_modelo ?? null, nome_modelo ?? null, texto_resumo ?? null)
      .run();
  }

  async markDigestSent(resumoId: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE resumos_diarios
            SET enviado_em = datetime('now')
          WHERE id = ?`
      )
      .bind(resumoId)
      .run();
  }

  async replaceDigestItems(resumoId: string, items: Array<Omit<DailyDigestItemRow, 'resumo_id'>>): Promise<void> {
    await this.db
      .prepare(`DELETE FROM itens_resumo_diario WHERE resumo_id = ?`)
      .bind(resumoId)
      .run();

    for (const item of items) {
      await this.db
        .prepare(
          `INSERT INTO itens_resumo_diario (id, resumo_id, noticia_id, ativo_id, bullets, ordem)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(item.id, resumoId, item.noticia_id, item.ativo_id ?? null, item.bullets ?? null, item.ordem)
        .run();
    }
  }

  async listDigestItems(resumoId: string): Promise<DailyDigestItemRow[]> {
    const res = await this.db
      .prepare(
        `SELECT *
           FROM itens_resumo_diario
          WHERE resumo_id = ?
          ORDER BY ordem ASC`
      )
      .bind(resumoId)
      .all<DailyDigestItemRow>();

    return res.results ?? [];
  }
}
