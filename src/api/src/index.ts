// Entry point do Cloudflare Worker - InvestAlerta API

import { Env } from './types/env';
import { Router } from './lib/router';
import { logger } from './lib/logger';

// Controllers
import { healthCheck, livenessCheck, readinessCheck } from './controllers/health.controller';
import { register, login } from './controllers/auth.controller';
import { getMe, updateMe, deleteMe } from './controllers/user.controller';

// Middlewares
import { authMiddleware } from './middlewares/auth.middleware';

// Criar router
const router = new Router();

// ============================================
// ROTAS PUBLICAS
// ============================================

// Health checks
router.get('/api/v1/health', healthCheck);
router.get('/api/v1/health/live', livenessCheck);
router.get('/api/v1/health/ready', readinessCheck);

// Autenticacao
router.post('/api/v1/auth/register', register);
router.post('/api/v1/auth/login', login);

// ============================================
// ROTAS PROTEGIDAS (requerem autenticacao)
// ============================================

// Usuario
router.get('/api/v1/users/me', getMe, [authMiddleware]);
router.patch('/api/v1/users/me', updateMe, [authMiddleware]);
router.delete('/api/v1/users/me', deleteMe, [authMiddleware]);

// ============================================
// ROTA RAIZ - Documentacao
// ============================================

router.get('/', async (request, env, ctx) => {
  const docs = {
    name: 'InvestAlerta API',
    version: env.API_VERSION || 'v1',
    description: 'API para monitoramento de ativos financeiros com alertas de preco',
    endpoints: {
      health: {
        'GET /api/v1/health': 'Status geral da API',
        'GET /api/v1/health/live': 'Verificacao de liveness',
        'GET /api/v1/health/ready': 'Verificacao de readiness',
      },
      auth: {
        'POST /api/v1/auth/register': 'Registrar novo usuario',
        'POST /api/v1/auth/login': 'Fazer login',
      },
      users: {
        'GET /api/v1/users/me': 'Obter dados do usuario logado',
        'PATCH /api/v1/users/me': 'Atualizar dados do usuario',
        'DELETE /api/v1/users/me': 'Deletar conta do usuario',
      },
    },
    documentation: 'https://github.com/seu-usuario/investalerta',
  };

  return new Response(JSON.stringify(docs, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

// ============================================
// EXPORT DO WORKER
// ============================================

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Configurar nivel de log baseado no ambiente
      if (env.ENVIRONMENT === 'development') {
        logger.setLevel('debug');
      }

      return await router.handle(request, env);
    } catch (error) {
      logger.error('Erro nao tratado no Worker', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Erro interno do servidor',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
