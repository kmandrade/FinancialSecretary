import { ValidationError } from '../lib/errors';
import { AlertRepository, type AlertRow } from '../repositories/alert.repository';

export class AlertService {
  constructor(private readonly repo: AlertRepository) {}

  async list(userId: string): Promise<AlertRow[]> {
    return this.repo.listByUser(userId);
  }

  async get(userId: string, alertId: string): Promise<AlertRow | null> {
    return this.repo.getById(userId, alertId);
  }

  async create(params: {
    userId: string;
    assetId: string;
    condicao: AlertRow['condicao'];
    precoAlvo: number;
    cooldownMinutos?: number;
    maxAlertsPerAsset: number;
  }): Promise<string> {
    const count = await this.repo.countActiveByUserAndAsset(params.userId, params.assetId);
    if (count >= params.maxAlertsPerAsset) {
      throw new ValidationError(
        `Limite do plano atingido. Máximo de ${params.maxAlertsPerAsset} alertas por ativo.`
      );
    }

    const id = await this.repo.create({
      usuario_id: params.userId,
      ativo_id: params.assetId,
      condicao: params.condicao,
      preco_alvo: params.precoAlvo,
      cooldown_minutos: params.cooldownMinutos
    });

    return id;
  }

  async update(userId: string, alertId: string, patch: Partial<Pick<AlertRow, 'condicao' | 'preco_alvo' | 'ativo' | 'cooldown_minutos'>>): Promise<void> {
    await this.repo.update(userId, alertId, {
      condicao: patch.condicao,
      preco_alvo: patch.preco_alvo,
      ativo: patch.ativo,
      cooldown_minutos: patch.cooldown_minutos
    });
  }

  async remove(userId: string, alertId: string): Promise<void> {
    await this.repo.delete(userId, alertId);
  }

  async listEvents(userId: string, limit = 50) {
    return this.repo.listHistoryByUser(userId, limit);
  }
}
