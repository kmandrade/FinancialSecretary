export function buildOpenApiSpec(baseUrl: string) {
  return {
    openapi: '3.0.3',
    info: {
      title: 'FinancialSecretary API',
      version: '0.1.0',
      description: 'API do FinancialSecretary (Cloudflare Workers + D1)'
    },
    servers: [{ url: baseUrl.replace(/\/$/, '') }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/v1/health': {
        get: {
          summary: 'Healthcheck',
          security: [],
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/v1/auth/register': {
        post: {
          summary: 'Criar conta',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'senha', 'nome', 'aceitou_termos'],
                  properties: {
                    email: { type: 'string' },
                    senha: { type: 'string' },
                    nome: { type: 'string' },
                    aceitou_termos: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/v1/auth/login': {
        post: {
          summary: 'Login',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'senha'],
                  properties: {
                    email: { type: 'string' },
                    senha: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/v1/me': {
        get: { summary: 'Dados da conta', responses: { '200': { description: 'OK' } } },
        put: { summary: 'Atualizar conta', responses: { '200': { description: 'OK' } } },
        delete: { summary: 'Excluir conta (soft delete)', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/preferences': {
        get: { summary: 'Preferências do usuário', responses: { '200': { description: 'OK' } } },
        put: { summary: 'Atualizar preferências do usuário', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/assets/search': {
        get: {
          summary: 'Buscar ativo por ticker/nome',
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string' }, required: true }],
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/v1/news': {
        get: {
          summary: 'Notícias relacionadas aos ativos do usuário',
          parameters: [
            { name: 'sinceHours', in: 'query', schema: { type: 'integer', default: 24 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } }
          ],
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/v1/digest/latest': {
        get: { summary: 'Resumo diário mais recente', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/watchlist': {
        get: { summary: 'Listar watchlist', responses: { '200': { description: 'OK' } } },
        post: { summary: 'Adicionar ativo', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/watchlist/{ticker}': {
        delete: {
          summary: 'Remover ativo',
          parameters: [{ name: 'ticker', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/v1/alerts': {
        get: { summary: 'Listar alertas', responses: { '200': { description: 'OK' } } },
        post: { summary: 'Criar alerta', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/alerts/{id}': {
        put: {
          summary: 'Atualizar alerta',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'OK' } }
        },
        delete: {
          summary: 'Excluir alerta',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'OK' } }
        }
      },
      '/api/v1/notifications/devices': {
        get: { summary: 'Listar dispositivos do usuário', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/notifications/device': {
        post: { summary: 'Registrar/atualizar dispositivo', responses: { '201': { description: 'Created' } } }
      },
      '/api/v1/notifications/push/subscribe': {
        post: { summary: 'Salvar subscription de Web Push', responses: { '201': { description: 'Created' } } }
      },
      '/api/v1/notifications/push/revoke': {
        post: { summary: 'Revogar subscription de Web Push', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/notifications/push/permission': {
        post: { summary: 'Registrar estado de permissão de notificação', responses: { '201': { description: 'Created' } } }
      },
      '/api/v1/notifications/messages': {
        get: { summary: 'Listar mensagens de notificação do usuário', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/dashboard': {
        get: { summary: 'Dashboard', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/crypto/prices': {
        get: { summary: 'Preço cripto (BTC/ETH/SOL)', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/admin/summary': {
        get: { summary: 'Admin: métricas básicas', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/admin/jobs/recent': {
        get: { summary: 'Admin: jobs recentes', responses: { '200': { description: 'OK' } } }
      },
      '/api/v1/admin/errors/recent': {
        get: { summary: 'Admin: erros recentes', responses: { '200': { description: 'OK' } } }
      }
    }
  };
}
