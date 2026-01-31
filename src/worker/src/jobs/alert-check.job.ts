import { BaseJob, JobResult } from "./base.job.js";
import { config } from "../config/index.js";

/**
 * Job responsavel por verificar alertas de preco e disparar notificacoes
 * 
 * Fluxo:
 * 1. Buscar todos os alertas ativos
 * 2. Para cada alerta, verificar se a condicao foi atingida
 * 3. Se atingida, verificar cooldown (anti-spam)
 * 4. Disparar notificacao (push/email)
 * 5. Registrar no historico de alertas
 * 6. Atualizar status do alerta
 */
export class AlertCheckJob extends BaseJob {
  constructor() {
    super("AlertCheck", config.jobs.alertCheck);
  }

  protected async execute(): Promise<JobResult> {
    // TODO: Implementar integracao com banco de dados
    
    this.logger.info("Verificando alertas ativos...");
    
    // Simulacao
    const mockAlerts = [
      { id: "1", ticker: "PETR4", condition: "ABOVE", targetPrice: 40, currentPrice: 38.50 },
      { id: "2", ticker: "VALE3", condition: "BELOW", targetPrice: 60, currentPrice: 65.20 },
    ];

    let triggeredCount = 0;

    for (const alert of mockAlerts) {
      const triggered = this.checkCondition(alert);
      
      if (triggered) {
        this.logger.info(`Alerta ${alert.id} disparado: ${alert.ticker} ${alert.condition} ${alert.targetPrice}`);
        triggeredCount++;
        // TODO: Enviar notificacao
        // TODO: Registrar no historico
      }
    }

    return {
      success: true,
      message: `${triggeredCount} alertas disparados de ${mockAlerts.length} verificados`,
      data: {
        totalChecked: mockAlerts.length,
        triggered: triggeredCount,
      },
      duration: 0,
    };
  }

  private checkCondition(alert: { condition: string; targetPrice: number; currentPrice: number }): boolean {
    if (alert.condition === "ABOVE") {
      return alert.currentPrice >= alert.targetPrice;
    }
    if (alert.condition === "BELOW") {
      return alert.currentPrice <= alert.targetPrice;
    }
    return false;
  }
}
