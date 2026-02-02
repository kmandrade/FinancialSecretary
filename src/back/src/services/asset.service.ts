import type { Env } from '../types/env';
import { NotFoundError, ValidationError } from '../lib/errors';
import { MarketDataService } from './market_data.service';
import { AssetRepository } from '../repositories/asset.repository';

export type AssetWithLatest = {
  id: string;
  ticker: string;
  nome_curto: string | null;
  tipo: 'ACAO' | 'FII' | 'CRIPTO';
  bolsa: string | null;
  last_price: number | null;
  last_updated_at: string | null;
  source: string | null;
};

export class AssetService {
  constructor(
    private env: Env,
    private assetRepo: AssetRepository,
    private marketData: MarketDataService
  ) {}

  async search(query: string): Promise<{ id: string; ticker: string; nome_curto: string | null; tipo: string }[]> {
    if (!query || query.trim().length < 1) throw new ValidationError('query é obrigatório');
    return this.assetRepo.searchByTickerOrName(query.trim());
  }

  async getByTicker(ticker: string): Promise<AssetWithLatest> {
    const asset = await this.assetRepo.getByTicker(ticker.trim().toUpperCase());
    if (!asset) throw new NotFoundError('Ativo não encontrado');

    const quote = await this.assetRepo.getLatestQuoteByAssetId(asset.id);

    return {
      id: asset.id,
      ticker: asset.ticker,
      nome_curto: asset.nome_curto,
      tipo: asset.tipo as any,
      bolsa: asset.bolsa,
      last_price: quote?.preco ?? null,
      last_updated_at: quote?.buscado_em ?? null,
      source: quote?.fonte ?? null,
    };
  }

  async ensureAssetExists(ticker: string): Promise<{ id: string; ticker: string; tipo: string; nome_curto: string | null }>{
    const t = ticker.trim().toUpperCase();
    const existing = await this.assetRepo.getByTicker(t);
    if (existing) return existing;

    const isCrypto = ['BTC', 'ETH', 'SOL'].includes(t);
    const created = await this.assetRepo.createAsset({
      id: crypto.randomUUID(),
      ticker: t,
      nome_curto: isCrypto ? t : null,
      tipo: isCrypto ? 'CRIPTO' : 'ACAO',
      bolsa: isCrypto ? 'GLOBAL' : 'B3',
    });
    return created;
  }

  async refreshAndStoreQuoteByAsset(ticker: string): Promise<{ price: number; quotedAt: string; source: string; nameShort?: string | null } | null> {
    const t = ticker.trim().toUpperCase();
    const asset = await this.ensureAssetExists(t);
    const quote = await this.marketData.fetchQuote(t, asset.tipo as any);
    if (!quote) return null;

    if (quote.nameShort && quote.nameShort !== asset.nome_curto) {
      await this.assetRepo.updateNameShort(asset.id, quote.nameShort);
    }

    await this.assetRepo.insertQuote({
      id: crypto.randomUUID(),
      ativo_id: asset.id,
      preco: quote.price,
      cotado_em: quote.quotedAt || new Date().toISOString(),
      fonte: quote.source,
    });

    return quote;
  }

  async getCryptoSnapshot(): Promise<Array<{ ticker: string; price: number | null; updatedAt: string | null; source: string | null }>> {
    const out: Array<{ ticker: string; price: number | null; updatedAt: string | null; source: string | null }> = [];
    for (const t of ['BTC', 'ETH', 'SOL']) {
      const asset = await this.ensureAssetExists(t);
      const quote = await this.assetRepo.getLatestQuoteByAssetId(asset.id);
      out.push({
        ticker: t,
        price: quote?.preco ?? null,
        updatedAt: quote?.buscado_em ?? null,
        source: quote?.fonte ?? null,
      });
    }
    return out;
  }
}
