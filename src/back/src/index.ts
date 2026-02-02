import { Router } from './lib/router';
import { errorMiddleware } from './middlewares/error.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { requireAuthMiddleware } from './middlewares/require_auth.middleware';

import { registerAuthController } from './controllers/auth.controller';
import { registerAccountController } from './controllers/account.controller';
import { registerAssetsController } from './controllers/assets.controller';
import { registerWatchlistController } from './controllers/watchlist.controller';
import { registerAlertsController } from './controllers/alerts.controller';
import { registerPreferencesController } from './controllers/preferences.controller';
import { registerCryptoController } from './controllers/crypto.controller';
import { registerDocsController } from './controllers/docs.controller';
import { registerNotificationsController } from './controllers/notifications.controller';
import { registerDashboardController } from './controllers/dashboard.controller';
import { registerNewsController } from './controllers/news.controller';
import { registerDigestController } from './controllers/digest.controller';
import { registerAdminController } from './controllers/admin.controller';

import type { Env } from './types/env';
import { handleScheduled } from './jobs/scheduler';

function buildRouter(env: Env) {
  const router = new Router();
  
  router.use(errorMiddleware);         
  router.use(corsMiddleware);    
  router.use(authMiddleware);
  router.use(requireAuthMiddleware); 

  registerDocsController(router);
  registerAuthController(router);
  registerAccountController(router);
  registerPreferencesController(router);
  registerAssetsController(router);
  registerWatchlistController(router);
  registerAlertsController(router);
  registerCryptoController(router);
  registerNewsController(router);
  registerDigestController(router);
  registerNotificationsController(router);
  registerDashboardController(router);
  registerAdminController(router);

  router.get('/', async () => new Response('FinancialSecretary Worker API'));

  return router;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const router = buildRouter(env);
    return router.handle(request, env);
  },

  async scheduled(event: any, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(handleScheduled(event, env));
  }
};
