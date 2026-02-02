import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { AssetRepository } from '../repositories/asset.repository';
import { NewsRepository } from '../repositories/news.repository';
import { AssetService } from '../services/asset.service';
import { MarketDataService } from '../services/market_data.service';

export function registerAssetsController(router: Router) {
  router.get('/api/v1/assets/search', async (ctx) => {
    const url = new URL(ctx.req.url);
    const q = (url.searchParams.get('query') || url.searchParams.get('q') || '').trim();

    if (!q) return jsonResponse({ assets: [] });

    const repo = new AssetRepository(ctx.env);
    const assets = await repo.searchByTickerOrName(q);

    return jsonResponse({ assets });
  });

  router.get('/api/v1/assets/:ticker', async (ctx) => {
    const ticker = (ctx.params.ticker || '').trim().toUpperCase();

    const assetRepo = new AssetRepository(ctx.env);
    const market = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, market);

    const asset = await assetService.ensureAssetExists(ticker);
    const latest = await assetRepo.getLatestQuoteByAssetId(asset.id);

    return jsonResponse({ asset, latest_quote: latest });
  });

  router.get('/api/v1/assets/:ticker/news', async (ctx) => {
    const ticker = (ctx.params.ticker || '').trim().toUpperCase();
    const assetRepo = new AssetRepository(ctx.env);
    const asset = await assetRepo.getByTicker(ticker);
    if (!asset) return jsonResponse({ news: [] }, { status: 200 });

    const url = new URL(ctx.req.url);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || '20')));

    const newsRepo = new NewsRepository(ctx.env.DB);
    const news = await newsRepo.listNewsForAsset(asset.id, limit);

    return jsonResponse({ asset: { id: asset.id, ticker: asset.ticker }, news });
  });
}
