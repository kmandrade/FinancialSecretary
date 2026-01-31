import cron from "node-cron";
import { createJobLogger } from "../config/logger.js";

export interface JobResult {
  success: boolean;
  message: string;
  data?: unknown;
  duration: number;
}

export abstract class BaseJob {
  protected readonly name: string;
  protected readonly cronExpression: string;
  protected readonly logger: ReturnType<typeof createJobLogger>;
  private task: cron.ScheduledTask | null = null;
  private isRunning = false;

  constructor(name: string, cronExpression: string) {
    this.name = name;
    this.cronExpression = cronExpression;
    this.logger = createJobLogger(name);
  }

  // Metodo abstrato que deve ser implementado por cada job
  protected abstract execute(): Promise<JobResult>;

  // Inicia o job agendado
  public start(): void {
    if (this.task) {
      this.logger.warn("Job ja esta rodando");
      return;
    }

    this.task = cron.schedule(this.cronExpression, async () => {
      await this.run();
    });

    this.logger.info(`Job iniciado com cron: ${this.cronExpression}`);
  }

  // Para o job agendado
  public stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      this.logger.info("Job parado");
    }
  }

  // Executa o job manualmente
  public async run(): Promise<JobResult> {
    if (this.isRunning) {
      this.logger.warn("Job ja esta em execucao, pulando...");
      return {
        success: false,
        message: "Job ja esta em execucao",
        duration: 0,
      };
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      this.logger.info("Iniciando execucao...");
      const result = await this.execute();
      const duration = Date.now() - startTime;

      if (result.success) {
        this.logger.info(`Concluido com sucesso em ${duration}ms: ${result.message}`);
      } else {
        this.logger.error(`Falhou apos ${duration}ms: ${result.message}`);
      }

      return { ...result, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      
      this.logger.error(`Erro apos ${duration}ms: ${errorMessage}`);
      
      return {
        success: false,
        message: errorMessage,
        duration,
      };
    } finally {
      this.isRunning = false;
    }
  }

  // Retorna status do job
  public getStatus() {
    return {
      name: this.name,
      cronExpression: this.cronExpression,
      isScheduled: this.task !== null,
      isRunning: this.isRunning,
    };
  }
}
