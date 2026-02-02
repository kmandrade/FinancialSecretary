import { ValidationError } from '../lib/errors';
import { WatchlistRepository } from '../repositories/watchlist.repository';

export class WatchlistService {
  constructor(private readonly repo: WatchlistRepository) {}

  async add(userId: string, assetId: string, maxAllowed: number): Promise<string> {
    const current = await this.repo.countActiveByUser(userId);
    if (current >= maxAllowed) {
      throw new ValidationError(`Limite do plano atingido. Máximo de ${maxAllowed} ativos acompanhados.`);
    }
    return this.repo.add(userId, assetId);
  }

  async remove(userId: string, assetId: string): Promise<void> {
    return this.repo.remove(userId, assetId);
  }
}
