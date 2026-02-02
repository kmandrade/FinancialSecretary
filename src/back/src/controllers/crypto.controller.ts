import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { MarketDataService } from '../services/market_data.service';
import { AssetRepository } from '../repositories/asset.repository';
import { AssetService } from '../services/asset.service';

const CRYPTO_TICKERS = ['BTC', 'ETH', 'SOL'];

export function registerCryptoController(router: Router) {
  router.get('/api/v1/crypto/prices', async (ctx) => {
    const assetRepo = new AssetRepository(ctx.env);
    const market = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, market);

    const items = [] as any[];
    for (const ticker of CRYPTO_TICKERS) {
      const asset = await assetService.ensureAssetExists(ticker);
      const quote = await assetRepo.getLatestQuoteByAssetId(asset.id);
      items.push({ asset, latest_quote: quote });
    }

    return jsonResponse({ items });
  });
}
