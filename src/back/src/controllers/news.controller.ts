import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { requireUser } from './_helpers';
import { NewsRepository } from '../repositories/news.repository';

export function registerNewsController(router: Router) {
  router.get('/api/v1/news', async (ctx) => {
    const user = requireUser(ctx);
    const sinceHours = ctx.query.sinceHours ? Number(ctx.query.sinceHours) : 24;
    const limit = ctx.query.limit ? Number(ctx.query.limit) : 50;

    const repo = new NewsRepository(ctx.env.DB);
    const news = await repo.listNewsForUserWatchlist(user.id, Number.isFinite(sinceHours) ? sinceHours : 24, Number.isFinite(limit) ? limit : 50);

    return jsonResponse({ news });
  });
}
