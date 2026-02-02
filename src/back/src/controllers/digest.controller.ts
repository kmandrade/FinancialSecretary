import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { requireUser } from './_helpers';
import { DigestRepository } from '../repositories/digest.repository';

export function registerDigestController(router: Router) {
  router.get('/api/v1/digest/latest', async (ctx) => {
    const user = requireUser(ctx);
    const repo = new DigestRepository(ctx.env.DB);
    const digest = await repo.getLatestDigestForUser(user.id);
    if (!digest) return jsonResponse({ digest: null });
    const items = await repo.listDigestItems(digest.id);
    return jsonResponse({ digest: { ...digest, items } });
  });
}
