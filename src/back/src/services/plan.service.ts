import { ForbiddenError } from '../lib/errors';
import { PlanRepository } from '../repositories/plan.repository';

export class PlanService {
  constructor(private planRepo: PlanRepository) {}

  async listPlans() {
    return await this.planRepo.listActivePlans();
  }

  async getPlanForUser(userId: string) {
    const plan = await this.planRepo.getCurrentPlanForUser(userId);
    if (plan) return plan;
    return await this.planRepo.getPlanByName('FREE');
  }

  ensureWatchlistLimit(currentCount: number, maxAllowed: number) {
    if (currentCount >= maxAllowed) {
      throw new ForbiddenError(`Limite do plano atingido: máximo de ${maxAllowed} ativos acompanhados.`);
    }
  }

  ensureAlertLimit(currentCount: number, maxAllowed: number) {
    if (currentCount >= maxAllowed) {
      throw new ForbiddenError(`Limite do plano atingido: máximo de ${maxAllowed} alertas por ativo.`);
    }
  }
}
