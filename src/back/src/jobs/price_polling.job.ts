import type { Env } from '../types/env';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { AlertRepository, type AlertRow } from '../repositories/alert.repository';
import { AssetRepository } from '../repositories/asset.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { JobRepository } from '../repositories/job.repository';
import { MarketDataService } from '../services/market_data.service';

function isConditionMet(alert: AlertRow, price: number): boolean {
  if (alert.condicao === 'ACIMA_OU_IGUAL') return price >= alert.preco_alvo;
  if (alert.condicao === 'ABAIXO_OU_IGUAL') return price <= alert.preco_alvo;
  return false;
}

function minutesBetween(aIso: string, bIso: string): number {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.POSITIVE_INFINITY;
  return Math.abs(a - b) / 60000;
}

export async function runPricePolling(env: Env, meta?: { cron?: string }): Promise<{ processed: number; alertsTriggered: number; errors: number }> {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution('POLLING_PRECO', { cron: meta?.cron ?? null });

  const watchlistRepo = new WatchlistRepository(env.DB);
  const alertRepo = new AlertRepository(env.DB);
  const assetRepo = new AssetRepository(env.DB);
  const notifRepo = new NotificationRepository(env.DB);
  const market = new MarketDataService(env);

  let processed = 0;
  let alertsTriggered = 0;
  let errors = 0;

  try {
    const watchIds = await watchlistRepo.listDistinctActiveAssetIds();
    const alertIds = await alertRepo.listDistinctActiveAssetIds();
    const assetIds = Array.from(new Set([...watchIds, ...alertIds]));

    if (assetIds.length === 0) {
      await jobRepo.finishExecution(execId, 'SUCESSO', { qtdProcessada: 0, qtdErros: 0, detalhes: { note: 'no-assets' } });
      return { processed: 0, alertsTriggered: 0, errors: 0 };
    }

    const alerts = await alertRepo.listActiveByAssetIds(assetIds);
    const alertsByAsset = new Map<string, AlertRow[]>();
    for (const a of alerts) {
      if (!alertsByAsset.has(a.ativo_id)) alertsByAsset.set(a.ativo_id, []);
      alertsByAsset.get(a.ativo_id)!.push(a);
    }

    for (const assetId of assetIds) {
      const asset = await assetRepo.getById(assetId);
      if (!asset) continue;

      try {
        const quote = await market.fetchQuote(asset.ticker, asset.tipo);
        if (!quote) continue;

        if (!asset.nome_curto && quote.nameShort) {
          await assetRepo.updateNameShort(asset.id, quote.nameShort);
        }

        await assetRepo.insertQuote({
          id: crypto.randomUUID(),
          ativo_id: asset.id,
          preco: quote.price,
          cotado_em: quote.quotedAt,
          buscado_em: new Date().toISOString(),
          fonte: quote.source
        });

        processed += 1;

        const assetAlerts = alertsByAsset.get(asset.id) ?? [];
        if (assetAlerts.length === 0) continue;

        for (const alert of assetAlerts) {
          if (!isConditionMet(alert, quote.price)) continue;

          if (alert.ultimo_disparo_em) {
            const mins = minutesBetween(alert.ultimo_disparo_em, new Date().toISOString());
            if (mins < (alert.cooldown_minutos ?? 30)) {
              continue;
            }
          }

          await alertRepo.createFireEvent({
            id: crypto.randomUUID(),
            alerta_id: alert.id,
            usuario_id: alert.usuario_id,
            ativo_id: alert.ativo_id,
            preco_observado: quote.price,
            motivo: 'CONDICAO_ATINGIDA'
          });
          await alertRepo.markFired(alert.id);

          const condText = alert.condicao === 'ACIMA_OU_IGUAL' ? 'acima/igual' : 'abaixo/igual';
          const title = `Alerta: ${asset.ticker} ${condText} ${alert.preco_alvo}`;
          const body = `Preço observado: ${quote.price} (${quote.quotedAt}).`;

          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: alert.usuario_id,
            tipo: 'ALERTA_PRECO',
            canal: 'PUSH',
            titulo: title,
            corpo: body,
            deep_link: `/ativos/${asset.ticker}`
          });

          alertsTriggered += 1;
        }
      } catch (e: any) {
        errors += 1;
        await jobRepo.logError({
          tipo_job: 'POLLING_PRECO',
          ativo_id: assetId,
          mensagem: e?.message ?? 'Erro no polling de preço',
          stack: e?.stack,
          contexto: { assetId }
        });
      }
    }

    await jobRepo.finishExecution(execId, errors === 0 ? 'SUCESSO' : 'PARCIAL', {
      qtdProcessada: processed,
      qtdErros: errors,
      detalhes: { alertsTriggered }
    });

    return { processed, alertsTriggered, errors };
  } catch (e: any) {
    await jobRepo.finishExecution(execId, 'FALHA', {
      qtdProcessada: processed,
      qtdErros: errors + 1,
      detalhes: { error: e?.message ?? 'unknown' }
    });
    throw e;
  }
}
