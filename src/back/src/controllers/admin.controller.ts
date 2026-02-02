import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { AppError } from '../lib/errors';
import { requireUser } from './_helpers';
import { JobRepository } from '../repositories/job.repository';

function requireAdmin(ctx: any) {
  const user = requireUser(ctx);
  if (user.perfil !== 'ADMIN') {
    throw new AppError(403, "403",'Acesso negado.');
  }
  return user;
}

export function registerAdminController(router: Router) {
  router.get('/api/v1/admin/summary', async (ctx) => {
    requireAdmin(ctx);

    const db = ctx.env.DB;
    const usersRow = await db.prepare(`SELECT COUNT(1) as c FROM usuarios WHERE excluido_em IS NULL`).first<{ c: number }>();
    const subsRow = await db.prepare(`SELECT COUNT(1) as c FROM inscricoes_push WHERE valida = 1`).first<{ c: number }>();
    const watchRow = await db.prepare(`SELECT COUNT(1) as c FROM itens_watchlist WHERE ativo = 1`).first<{ c: number }>();
    const assetsRow = await db.prepare(`SELECT COUNT(1) as c FROM ativos WHERE ativo = 1`).first<{ c: number }>();

    return jsonResponse({
      totals: {
        users: usersRow?.c ?? 0,
        push_subscriptions_valid: subsRow?.c ?? 0,
        watchlist_items_active: watchRow?.c ?? 0,
        assets_active: assetsRow?.c ?? 0
      }
    });
  });

  router.get('/api/v1/admin/jobs/recent', async (ctx) => {
    requireAdmin(ctx);
    const repo = new JobRepository(ctx.env.DB);
    const jobs = await repo.listRecentExecutions(50);
    return jsonResponse({ jobs });
  });

  router.get('/api/v1/admin/errors/recent', async (ctx) => {
    requireAdmin(ctx);
    const repo = new JobRepository(ctx.env.DB);
    const errors = await repo.listRecentErrors(50);
    return jsonResponse({ errors });
  });
}
