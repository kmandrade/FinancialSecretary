import type { D1Database } from '@cloudflare/workers-types';

export class ErrorLogRepository {
  constructor(private db: D1Database) {}

  async insert(params: {
    tipo_job: 'POLLING_PRECO' | 'COLETA_NOTICIAS' | 'DEDUPE_NOTICIAS' | 'GERAR_RESUMO' | 'DISPARO_NOTIFICACOES';
    mensagem: string;
    stack?: string | null;
    usuario_id?: string | null;
    ativo_id?: string | null;
    contexto_json?: unknown;
  }): Promise<string> {
    const id = crypto.randomUUID();
    const ctx = params.contexto_json ? JSON.stringify(params.contexto_json) : null;
    await this.db.prepare(
      `INSERT INTO logs_erro (id, tipo_job, usuario_id, ativo_id, mensagem, stack, contexto_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      params.tipo_job,
      params.usuario_id ?? null,
      params.ativo_id ?? null,
      params.mensagem,
      params.stack ?? null,
      ctx
    ).run();
    return id;
  }
}
