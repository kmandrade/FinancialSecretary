import type { ScheduledEvent } from '@cloudflare/workers-types';
import type { Env } from '../types/env';
import { FeatureFlagsRepository } from '../repositories/feature_flags.repository';
import { runPricePolling } from './price_polling.job';
import { runNewsCollection } from './news_collection.job';
import { runDigestGeneration } from './digest_generation.job';
import { runDispatchNotifications } from './dispatch_notifications.job';

async function flagEnabled(flags: FeatureFlagsRepository, key: string): Promise<boolean> {
  try {
    return await flags.isEnabled(key);
  } catch {
    return true;
  }
}

export async function handleScheduled(event: ScheduledEvent, env: Env): Promise<void> {
  const cron = (event as any).cron ?? '';
  const flags = new FeatureFlagsRepository(env.DB);

  const runPolling = cron.includes('*/15') || cron.startsWith('*/15');
  const runHourly = cron === '0 * * * *';
  const runDaily = cron === '10 11 * * * *';

  if (runPolling && (await flagEnabled(flags, 'JOB_POLLING_PRECO'))) {
    await runPricePolling(env, { cron });
  }

  // Coleta de noticias a cada hora (dedupe mantém custo baixo)
  if (runHourly && (await flagEnabled(flags, 'JOB_COLETA_NOTICIAS'))) {
    await runNewsCollection(env, { cron, windowHours: 2 });
  }

  // Checa janela do resumo diário a cada hora
  if (runHourly && (await flagEnabled(flags, 'JOB_GERAR_RESUMO'))) {
    await runDigestGeneration(env, { cron, force: false });
  }

  // Rodada diária: reforço (gera pra quem estiver ativo)
  if (runDaily && (await flagEnabled(flags, 'JOB_GERAR_RESUMO'))) {
    await runDigestGeneration(env, { cron, force: true });
  }

  // Disparador de notificações roda em TODAS as execuções agendadas
  if (await flagEnabled(flags, 'JOB_DISPARO_PUSH') || (await flagEnabled(flags, 'JOB_DISPARO_EMAIL'))) {
    await runDispatchNotifications(env, { cron, limit: 150 });
  }
}
