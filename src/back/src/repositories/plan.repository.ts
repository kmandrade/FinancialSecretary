import type { D1Database } from '@cloudflare/workers-types';

export type PlanRow = {
  id: string;
  nome: 'FREE' | 'INTERMEDIARIO' | 'GOLD';
  max_ativos_acompanhados: number;
  max_alertas_por_ativo: number;
  ads_habilitado: number;
  preco_mensal: number;
  ativo: number;
  criado_em: string;
  atualizado_em: string;
};

export type SubscriptionRow = {
  id: string;
  usuario_id: string;
  plano_id: string;
  inicio_em: string;
  fim_em: string | null;
  renovacao_automatica: number;
  status: 'ATIVA' | 'INADIMPLENTE' | 'CANCELADA' | 'EXPIRADA';
  criado_em: string;
  atualizado_em: string;
};

export class PlanRepository {
  constructor(private db: D1Database) {}

  async listActivePlans() {
    const rs = await this.db
      .prepare(`SELECT * FROM planos WHERE ativo = 1 ORDER BY preco_mensal ASC`)
      .all<PlanRow>();
    return rs.results;
  }

  async getPlanByName(nome: PlanRow['nome']) {
    return await this.db
      .prepare(`SELECT * FROM planos WHERE nome = ? AND ativo = 1 LIMIT 1`)
      .bind(nome)
      .first<PlanRow>();
  }

  async getActiveSubscriptionForUser(userId: string) {
    const sub = await this.db
      .prepare(
        `
        SELECT *
          FROM assinaturas_usuario
         WHERE usuario_id = ?
           AND status IN ('ATIVA','INADIMPLENTE')
           AND (fim_em IS NULL OR datetime(fim_em) > datetime('now'))
         ORDER BY datetime(criado_em) DESC
         LIMIT 1
        `
      )
      .bind(userId)
      .first<SubscriptionRow>();

    return sub ?? null;
  }

  async getCurrentPlanForUser(userId: string): Promise<PlanRow | null> {
    const rs = await this.db
      .prepare(
        `
        SELECT p.*
          FROM assinaturas_usuario s
          JOIN planos p ON p.id = s.plano_id
         WHERE s.usuario_id = ?
           AND s.status IN ('ATIVA','INADIMPLENTE')
           AND (s.fim_em IS NULL OR datetime(s.fim_em) > datetime('now'))
           AND p.ativo = 1
         ORDER BY datetime(s.criado_em) DESC
         LIMIT 1
        `
      )
      .bind(userId)
      .first<PlanRow>();

    return rs ?? null;
  }

  async assignUserPlan(userId: string, planId: string) {
    const id = crypto.randomUUID();

    await this.db
      .prepare(
        `
        INSERT INTO assinaturas_usuario (id, usuario_id, plano_id, status)
        VALUES (?, ?, ?, 'ATIVA')
        `
      )
      .bind(id, userId, planId)
      .run();

    return id;
  }

  async ensureDefaultPlanForUser(userId: string, defaultPlanName: PlanRow['nome'] = 'FREE') {
    const current = await this.getCurrentPlanForUser(userId);
    if (current) return current;

    const plan = await this.getPlanByName(defaultPlanName);
    if (!plan) return null;

    await this.assignUserPlan(userId, plan.id);
    return plan;
  }
  async getUserPlan(userId: string) {
    return this.getCurrentPlanForUser(userId);
  }

}
