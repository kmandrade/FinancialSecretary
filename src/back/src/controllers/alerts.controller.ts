import type { Router } from '../lib/router';
import { jsonResponse, parseJson } from '../lib/http';
import { z } from 'zod';
import { requireUser } from './_helpers';
import { AlertRepository } from '../repositories/alert.repository';
import { PlanRepository } from '../repositories/plan.repository';
import { AssetRepository } from '../repositories/asset.repository';
import { MarketDataService } from '../services/market_data.service';
import { AssetService } from '../services/asset.service';
import { AlertService } from '../services/alert.service';

const CreateSchema = z.object({
  ticker: z.string().min(1).max(15),
  condicao: z.enum(['ACIMA_OU_IGUAL', 'ABAIXO_OU_IGUAL']),
  preco_alvo: z.number().positive(),
  cooldown_minutos: z.number().int().min(1).max(7 * 24 * 60).optional()
});

const PatchSchema = z.object({
  condicao: z.enum(['ACIMA_OU_IGUAL', 'ABAIXO_OU_IGUAL']).optional(),
  preco_alvo: z.number().positive().optional(),
  ativo: z.boolean().optional(),
  cooldown_minutos: z.number().int().min(1).max(7 * 24 * 60).optional()
});

export function registerAlertsController(router: Router) {
  router.get('/api/v1/alerts', async (ctx) => {
    const user = requireUser(ctx);
    const service = new AlertService(new AlertRepository(ctx.env.DB));
    const items = await service.list(user.id);
    return jsonResponse({ items });
  });

  router.get('/api/v1/alerts/events', async (ctx) => {
    const user = requireUser(ctx);
    const url = new URL(ctx.req.url);
    const limit = Number(url.searchParams.get('limit') ?? '50');
    const service = new AlertService(new AlertRepository(ctx.env.DB));
    const items = await service.listEvents(user.id, Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50);
    return jsonResponse({ items });
  });

  router.post('/api/v1/alerts', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, CreateSchema);

    const planRepo = new PlanRepository(ctx.env.DB);
    const plan = await planRepo.getCurrentPlanForUser(user.id);
    const maxPerAsset = plan?.max_alertas_por_ativo ?? 3;

    const assetRepo = new AssetRepository(ctx.env);
    const marketData = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, marketData);

    const asset = await assetService.ensureAssetExists(body.ticker);

    const alertService = new AlertService(new AlertRepository(ctx.env.DB));
    const id = await alertService.create({
      userId: user.id,
      assetId: asset.id,
      condicao: body.condicao,
      precoAlvo: body.preco_alvo,
      cooldownMinutos: body.cooldown_minutos,
      maxAlertsPerAsset: maxPerAsset
    });

    return jsonResponse({ id }, { status: 201 });
  });

  router.patch('/api/v1/alerts/:id', async (ctx) => {
    const user = requireUser(ctx);
    const id = ctx.params?.id ?? '';
    if (!id) return jsonResponse({ ok: false }, { status: 400 });

    const body = await parseJson(ctx.req, PatchSchema);
    const service = new AlertService(new AlertRepository(ctx.env.DB));

    await service.update(user.id, id, {
      condicao: body.condicao,
      preco_alvo: body.preco_alvo,
      ativo: body.ativo === undefined ? undefined : body.ativo ? 1 : 0,
      cooldown_minutos: body.cooldown_minutos
    });

    return jsonResponse({ ok: true });
  });

  router.delete('/api/v1/alerts/:id', async (ctx) => {
    const user = requireUser(ctx);
    const id = ctx.params?.id ?? '';
    if (!id) return jsonResponse({ ok: false }, { status: 400 });

    const service = new AlertService(new AlertRepository(ctx.env.DB));
    await service.remove(user.id, id);
    return jsonResponse({ ok: true });
  });
}
