import type { Env } from '../types/env';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { AssetRepository } from '../repositories/asset.repository';
import { NewsRepository } from '../repositories/news.repository';
import { JobRepository } from '../repositories/job.repository';
import { NewsService } from '../services/news.service';

export async function runNewsCollection(env: Env, meta?: { cron?: string; sinceHours?: number }): Promise<{ tickers: number; saved: number; errors: number }> {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution('COLETA_NOTICIAS', { cron: meta?.cron ?? null, sinceHours: meta?.sinceHours ?? null });

  const watchRepo = new WatchlistRepository(env.DB);
  const assetRepo = new AssetRepository(env.DB);
  const newsRepo = new NewsRepository(env.DB);
  const service = new NewsService(env, newsRepo);

  let errors = 0;
  let saved = 0;

  try {
    const assetIds = await watchRepo.listDistinctActiveAssetIds();
    const tickers: string[] = [];
    for (const id of assetIds) {
      const a = await assetRepo.getById(id);
      if (a?.ticker) tickers.push(a.ticker);
    }

    if (tickers.length === 0) {
      await jobRepo.finishExecution(execId, 'SUCESSO', { qtdProcessada: 0, qtdErros: 0, detalhes: { note: 'no-tickers' } });
      return { tickers: 0, saved: 0, errors: 0 };
    }

    try {
      const { saved: s } = await service.collectForTickers(tickers, { hours: meta?.sinceHours ?? 24 });
      saved = s;
    } catch (e: any) {
      errors += 1;
      await jobRepo.logError({ tipo_job: 'COLETA_NOTICIAS', mensagem: e?.message ?? 'Erro coletando notícias', stack: e?.stack });
    }

    await jobRepo.finishExecution(execId, errors === 0 ? 'SUCESSO' : 'PARCIAL', {
      qtdProcessada: tickers.length,
      qtdErros: errors,
      detalhes: { saved }
    });

    return { tickers: tickers.length, saved, errors };
  } catch (e: any) {
    await jobRepo.finishExecution(execId, 'FALHA', { qtdProcessada: 0, qtdErros: errors + 1, detalhes: { error: e?.message ?? 'unknown' } });
    throw e;
  }
}
