import type { D1Database } from '@cloudflare/workers-types';

export type JobType =
  | 'POLLING_PRECO'
  | 'COLETA_NOTICIAS'
  | 'DEDUPE_NOTICIAS'
  | 'GERAR_RESUMO'
  | 'DISPARO_NOTIFICACOES';

export type JobStatus = 'EXECUTANDO' | 'SUCESSO' | 'FALHA' | 'PARCIAL';

export interface JobExecutionRow {
  id: string;
  tipo: JobType;
  iniciado_em: string;
  finalizado_em: string | null;
  status: JobStatus;
  detalhes: string | null;
  qtd_processada: number | null;
  qtd_erros: number | null;
}

export interface JobErrorRow {
  id: string;
  ocorrido_em: string;
  tipo_job: JobType | null;
  usuario_id: string | null;
  ativo_id: string | null;
  mensagem: string;
  stack: string | null;
  contexto_json: string | null;
}

export class JobRepository {
  constructor(private readonly db: D1Database) {}

  async startExecution(tipo: JobType, detalhes?: unknown): Promise<string> {
    const id = crypto.randomUUID();
    const detalhesText = detalhes == null ? null : JSON.stringify(detalhes);
    await this.db
      .prepare(
        `INSERT INTO execucoes_job (id, tipo, status, detalhes, qtd_processada, qtd_erros)
         VALUES (?, ?, 'EXECUTANDO', ?, 0, 0)`
      )
      .bind(id, tipo, detalhesText)
      .run();
    return id;
  }

  async finishExecution(
    id: string,
    status: JobStatus,
    opts?: { detalhes?: unknown; qtdProcessada?: number; qtdErros?: number }
  ): Promise<void> {
    const detalhesText = opts?.detalhes == null ? null : JSON.stringify(opts.detalhes);
    await this.db
      .prepare(
        `UPDATE execucoes_job
           SET finalizado_em = datetime('now'),
               status = ?,
               detalhes = COALESCE(?, detalhes),
               qtd_processada = COALESCE(?, qtd_processada),
               qtd_erros = COALESCE(?, qtd_erros)
         WHERE id = ?`
      )
      .bind(status, detalhesText, opts?.qtdProcessada ?? null, opts?.qtdErros ?? null, id)
      .run();
  }

  async logError(payload: {
    tipo_job?: JobType;
    usuario_id?: string;
    ativo_id?: string;
    mensagem: string;
    stack?: string;
    contexto?: unknown;
  }): Promise<string> {
    const id = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO logs_erro (id, tipo_job, usuario_id, ativo_id, mensagem, stack, contexto_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        payload.tipo_job ?? null,
        payload.usuario_id ?? null,
        payload.ativo_id ?? null,
        payload.mensagem,
        payload.stack ?? null,
        payload.contexto == null ? null : JSON.stringify(payload.contexto)
      )
      .run();
    return id;
  }

  async listRecentExecutions(limit = 50): Promise<JobExecutionRow[]> {
    const { results } = await this.db
      .prepare(
        `SELECT id, tipo, iniciado_em, finalizado_em, status, detalhes, qtd_processada, qtd_erros
           FROM execucoes_job
       ORDER BY iniciado_em DESC
          LIMIT ?`
      )
      .bind(limit)
      .all<JobExecutionRow>();

    return results;
  }

  async listRecentErrors(limit = 50): Promise<JobErrorRow[]> {
    const { results } = await this.db
      .prepare(
        `SELECT id, ocorrido_em, tipo_job, usuario_id, ativo_id, mensagem, stack, contexto_json
           FROM logs_erro
       ORDER BY ocorrido_em DESC
          LIMIT ?`
      )
      .bind(limit)
      .all<JobErrorRow>();

    return results;
  }
}
