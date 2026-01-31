// Entry point do Cloudflare Worker - InvestAlerta Worker (Jobs em Background)
// Este worker e executado via Cron Triggers configurados no wrangler.toml

import { logger } from './lib/logger';

// Tipos do ambiente
interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  PRICE_UPDATE_INTERVAL: string;
  BRAPI_TOKEN?: string;
}

// ============================================
// JOBS
// ============================================

// Job: Atualizar precos dos ativos
async function updatePricesJob(env: Env): Promise<{ success: boolean; updated: number }> {
  logger.info('Iniciando job: updatePrices');
  
  try {
    // Buscar todos os ativos
    const assets = await env.DB
      .prepare('SELECT id, ticker, type FROM assets')
      .all<{ id: string; ticker: string; type: string }>();

    if (!assets.results.length) {
      logger.info('Nenhum ativo encontrado para atualizar');
      return { success: true, updated: 0 };
    }

    // TODO: Integrar com BRAPI ou outra API de precos
    // Por enquanto, simular atualizacao
    const now = new Date().toISOString();
    let updated = 0;

    for (const asset of assets.results) {
      // Simular preco aleatorio para demonstracao
      const mockPrice = Math.random() * 1000;
      
      await env.DB
        .prepare('UPDATE assets SET last_price = ?, price_updated_at = ?, updated_at = ? WHERE id = ?')
        .bind(mockPrice, now, now, asset.id)
        .run();
      
      updated++;
    }

    logger.info(`Job updatePrices concluido: ${updated} ativos atualizados`);
    return { success: true, updated };
  } catch (error) {
    logger.error('Erro no job updatePrices', { error: error instanceof Error ? error.message : 'Unknown' });
    throw error;
  }
}

// Job: Verificar alertas disparados
async function checkAlertsJob(env: Env): Promise<{ success: boolean; triggered: number }> {
  logger.info('Iniciando job: checkAlerts');
  
  try {
    // Buscar alertas ativos
    const alerts = await env.DB
      .prepare(`
        SELECT 
          pa.id, pa.user_id, pa.asset_id, pa.condition, pa.target_price,
          a.ticker, a.last_price
        FROM price_alerts pa
        JOIN assets a ON pa.asset_id = a.id
        WHERE pa.status = 'ACTIVE'
      `)
      .all<{
        id: string;
        user_id: string;
        asset_id: string;
        condition: string;
        target_price: number;
        ticker: string;
        last_price: number;
      }>();

    if (!alerts.results.length) {
      logger.info('Nenhum alerta ativo encontrado');
      return { success: true, triggered: 0 };
    }

    let triggered = 0;
    const now = new Date().toISOString();

    for (const alert of alerts.results) {
      const shouldTrigger = 
        (alert.condition === 'ABOVE' && alert.last_price >= alert.target_price) ||
        (alert.condition === 'BELOW' && alert.last_price <= alert.target_price);

      if (shouldTrigger) {
        // Registrar no historico
        const historyId = `ah_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
        
        await env.DB
          .prepare(`
            INSERT INTO alert_history (id, alert_id, user_id, asset_id, ticker, condition, target_price, triggered_price, triggered_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(historyId, alert.id, alert.user_id, alert.asset_id, alert.ticker, alert.condition, alert.target_price, alert.last_price, now)
          .run();

        // Atualizar status do alerta
        await env.DB
          .prepare('UPDATE price_alerts SET status = ?, last_triggered_at = ?, updated_at = ? WHERE id = ?')
          .bind('TRIGGERED', now, now, alert.id)
          .run();

        triggered++;
        logger.info(`Alerta disparado: ${alert.ticker} ${alert.condition} ${alert.target_price}`);
        
        // TODO: Enviar notificacao push/email
      }
    }

    logger.info(`Job checkAlerts concluido: ${triggered} alertas disparados`);
    return { success: true, triggered };
  } catch (error) {
    logger.error('Erro no job checkAlerts', { error: error instanceof Error ? error.message : 'Unknown' });
    throw error;
  }
}

// Job: Enviar resumo diario
async function sendDailySummaryJob(env: Env): Promise<{ success: boolean; sent: number }> {
  logger.info('Iniciando job: sendDailySummary');
  
  try {
    // Buscar usuarios com resumo diario habilitado
    const users = await env.DB
      .prepare(`
        SELECT id, email, name 
        FROM users 
        WHERE daily_summary_enabled = 1
      `)
      .all<{ id: string; email: string; name: string }>();

    if (!users.results.length) {
      logger.info('Nenhum usuario com resumo diario habilitado');
      return { success: true, sent: 0 };
    }

    // TODO: Implementar envio de email
    logger.info(`Job sendDailySummary concluido: ${users.results.length} resumos para enviar`);
    return { success: true, sent: users.results.length };
  } catch (error) {
    logger.error('Erro no job sendDailySummary', { error: error instanceof Error ? error.message : 'Unknown' });
    throw error;
  }
}

// ============================================
// EXPORT DO WORKER
// ============================================

export default {
  // Handler para requisicoes HTTP (opcional - para monitoramento)
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Endpoint de status
    if (url.pathname === '/status') {
      return new Response(
        JSON.stringify({
          status: 'running',
          worker: 'investalerta-worker',
          environment: env.ENVIRONMENT,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response('InvestAlerta Worker - Use /status para verificar o status', {
      status: 200,
    });
  },

  // Handler para Cron Triggers
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const cronExpression = event.cron;
    
    logger.info(`Cron trigger executado: ${cronExpression}`);

    try {
      switch (cronExpression) {
        case '*/5 * * * *':
          // A cada 5 minutos - Atualizar precos
          ctx.waitUntil(updatePricesJob(env));
          break;

        case '0 * * * *':
          // A cada hora - Verificar alertas
          ctx.waitUntil(checkAlertsJob(env));
          break;

        case '0 8 * * *':
          // Todo dia as 8h - Enviar resumo diario
          ctx.waitUntil(sendDailySummaryJob(env));
          break;

        default:
          logger.warn(`Cron nao reconhecido: ${cronExpression}`);
      }
    } catch (error) {
      logger.error('Erro no scheduled handler', {
        cron: cronExpression,
        error: error instanceof Error ? error.message : 'Unknown',
      });
    }
  },
};
