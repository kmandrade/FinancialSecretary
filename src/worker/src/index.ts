import { config } from "./config/index.js";
import { logger } from "./config/logger.js";
import { PriceUpdateJob, AlertCheckJob, BaseJob } from "./jobs/index.js";

class WorkerManager {
  private jobs: BaseJob[] = [];

  constructor() {
    // Registrar todos os jobs
    this.jobs = [
      new PriceUpdateJob(),
      new AlertCheckJob(),
      // TODO: Adicionar mais jobs
      // new NewsCollectionJob(),
      // new DailySummaryJob(),
      // new LogCleanupJob(),
    ];
  }

  public start(): void {
    logger.info(`
====================================
  InvestAlerta Worker
====================================
  Ambiente: ${config.nodeEnv}
  Jobs registrados: ${this.jobs.length}
====================================
    `);

    // Iniciar todos os jobs
    for (const job of this.jobs) {
      job.start();
    }

    logger.info("Todos os jobs foram iniciados");
  }

  public stop(): void {
    logger.info("Parando todos os jobs...");
    
    for (const job of this.jobs) {
      job.stop();
    }

    logger.info("Todos os jobs foram parados");
  }

  public getStatus() {
    return this.jobs.map((job) => job.getStatus());
  }

  // Executar um job especifico manualmente
  public async runJob(jobName: string) {
    const job = this.jobs.find((j) => j.getStatus().name === jobName);
    
    if (!job) {
      throw new Error(`Job ${jobName} nao encontrado`);
    }

    return await job.run();
  }
}

// Criar e iniciar o manager
const manager = new WorkerManager();
manager.start();

// Graceful shutdown
const shutdown = () => {
  logger.info("Recebido sinal de shutdown...");
  manager.stop();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Tratamento de erros nao capturados
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", { error });
  process.exit(1);
});

export { manager };
