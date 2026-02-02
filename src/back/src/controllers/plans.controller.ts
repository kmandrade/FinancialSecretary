import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { PlanRepository } from '../repositories/plan.repository';

export function registerPlansController(router: Router) {
  router.get('/api/v1/plans', async (ctx) => {
    const repo = new PlanRepository(ctx.env.DB);
    const plans = await repo.listActivePlans();
    return jsonResponse({ plans }, { status: 200 });
  });
}
