import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { requireUser } from './_helpers';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { AssetRepository } from '../repositories/asset.repository';
import { AlertRepository } from '../repositories/alert.repository';
import { DigestRepository } from '../repositories/digest.repository';
import { NotificationRepository } from '../repositories/notification.repository';

export function registerDashboardController(router: Router) {
  router.get('/api/v1/dashboard', async (ctx) => {
    const user = requireUser(ctx);

    const watchlistRepo = new WatchlistRepository(ctx.env.DB);
    const assetRepo = new AssetRepository(ctx.env);
    const alertRepo = new AlertRepository(ctx.env.DB);
    const digestRepo = new DigestRepository(ctx.env.DB);
    const notifRepo = new NotificationRepository(ctx.env.DB);

    const watchlist = await watchlistRepo.listByUser(user.id);
    const watchlistWithQuote = await Promise.all(
      watchlist.map(async (i) => {
        const q = await assetRepo.getLatestQuoteByAssetId(i.ativo_id);
        return {
          ...i,
          cotacao: q ? { preco: q.preco, cotado_em: q.cotado_em, fonte: q.fonte } : null
        };
      })
    );

    const alerts = await alertRepo.listByUser(user.id);
    const alertHistory = await alertRepo.listHistoryByUser(user.id, 20);

    const lastDigest = await digestRepo.getLatestDigestForUser(user.id);
    const lastDigestItems = lastDigest ? await digestRepo.listDigestItems(lastDigest.id) : [];

    const messages = await notifRepo.listMessagesByUser(user.id, 20);

    return jsonResponse({
      watchlist: watchlistWithQuote,
      alerts,
      alert_history: alertHistory,
      last_digest: lastDigest ? { ...lastDigest, items: lastDigestItems } : null,
      notifications: messages
    });
  });
}
