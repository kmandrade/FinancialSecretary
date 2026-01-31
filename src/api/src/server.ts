import { createApp } from "./app.js";
import { config } from "./config/app.js";
import { logger } from "./config/logger.js";

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`
====================================
  InvestAlerta API
====================================
  Ambiente: ${config.nodeEnv}
  Porta: ${config.port}
  Documentacao: http://localhost:${config.port}/docs
  API: http://localhost:${config.port}${config.apiPrefix}
====================================
  `);
});

// Graceful shutdown
const shutdown = () => {
  logger.info("Recebido sinal de shutdown...");
  server.close(() => {
    logger.info("Servidor encerrado com sucesso");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Tratamento de erros nao capturados
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});
