import type { Router } from '../lib/router';
import { jsonResponse, parseJson } from '../lib/http';
import { z } from 'zod';
import { requireUser } from './_helpers';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { PlanRepository } from '../repositories/plan.repository';
import { AssetRepository } from '../repositories/asset.repository';
import { AssetService } from '../services/asset.service';
import { MarketDataService } from '../services/market_data.service';
import { WatchlistService } from '../services/watchlist.service';

const AddSchema = z.object({ ticker: z.string().min(1).max(15) });

export function registerWatchlistController(router: Router) {
  router.get('/api/v1/watchlist', async (ctx) => {
    const user = requireUser(ctx);
    const watchlistRepo = new WatchlistRepository(ctx.env.DB);
    const assetRepo = new AssetRepository(ctx.env);

    const items = await watchlistRepo.listByUser(user.id);

    const enriched = await Promise.all(
      items.map(async (it) => {
        const q = await assetRepo.getLatestQuoteByAssetId(it.ativo_id);
        return {
          ...it,
          ultimo_preco: q?.preco ?? null,
          ultima_atualizacao: q?.buscado_em ?? null
        };
      })
    );

    return jsonResponse({ items: enriched });
  });

  router.post('/api/v1/watchlist', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, AddSchema);

    const planRepo = new PlanRepository(ctx.env.DB);
    const watchlistRepo = new WatchlistRepository(ctx.env.DB);

    const plan = await planRepo.getCurrentPlanForUser(user.id);
    const maxAllowed = plan?.max_ativos_acompanhados ?? 2;

    const assetRepo = new AssetRepository(ctx.env);
    const marketData = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, marketData);

    const watchlistService = new WatchlistService(watchlistRepo);

    const asset = await assetService.ensureAssetExists(body.ticker);
    await watchlistService.add(user.id, asset.id, maxAllowed);

    return jsonResponse({ ok: true }, { status: 201 });
  });

  router.delete('/api/v1/watchlist/:ticker', async (ctx) => {
    const user = requireUser(ctx);
    const ticker = (ctx.params?.ticker ?? '').toUpperCase();
    if (!ticker) return jsonResponse({ ok: false }, { status: 400 });

    const assetRepo = new AssetRepository(ctx.env);
    const asset = await assetRepo.getByTicker(ticker);
    if (!asset) return jsonResponse({ ok: true });

    const watchlistRepo = new WatchlistRepository(ctx.env.DB);
    const service = new WatchlistService(watchlistRepo);
    await service.remove(user.id, asset.id);
    return jsonResponse({ ok: true });
  });
}
