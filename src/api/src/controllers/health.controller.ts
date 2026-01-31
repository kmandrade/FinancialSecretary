import { Request, Response } from "express";

const startTime = Date.now();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar saude da API
 *     description: Retorna o status de saude da API e informacoes basicas
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
export const healthCheck = async (_req: Request, res: Response) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  
  res.json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      uptime,
      environment: process.env.NODE_ENV || "development",
    },
  });
};

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Verificar se a API esta pronta
 *     description: Verifica se todos os servicos dependentes estao disponiveis
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API pronta para receber requisicoes
 *       503:
 *         description: API nao esta pronta
 */
export const readinessCheck = async (_req: Request, res: Response) => {
  // TODO: Adicionar verificacao de banco de dados e outros servicos
  const checks = {
    database: true, // Placeholder
    redis: true, // Placeholder
  };

  const allHealthy = Object.values(checks).every((v) => v);

  if (allHealthy) {
    res.json({
      success: true,
      data: {
        status: "ready",
        checks,
      },
    });
  } else {
    res.status(503).json({
      success: false,
      error: "Servico nao esta pronto",
      data: {
        status: "not_ready",
        checks,
      },
    });
  }
};

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Verificar se a API esta viva
 *     description: Endpoint simples para verificar se a API esta respondendo
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API esta viva
 */
export const livenessCheck = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: "alive",
      timestamp: new Date().toISOString(),
    },
  });
};
