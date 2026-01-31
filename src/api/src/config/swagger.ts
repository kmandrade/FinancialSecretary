import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "InvestAlerta API",
      version: "1.0.0",
      description: `
## API do InvestAlerta

Sistema de monitoramento de ativos financeiros com alertas de preco em tempo real.

### Funcionalidades principais:
- **Autenticacao**: Cadastro, login e recuperacao de senha
- **Ativos**: Busca e monitoramento de acoes, FIIs e criptomoedas
- **Alertas**: Criacao de alertas de preco (acima/abaixo)
- **Notificacoes**: Push notifications e email
- **Resumo Diario**: Noticias e analises dos ativos monitorados

### Planos disponiveis:
| Plano | Ativos | Anuncios |
|-------|--------|----------|
| Free | 2 | Sim |
| Intermediario | 6 | Nao |
| Gold | 20 | Nao |

### Delay de precos:
Os precos sao atualizados com delay de 5 a 15 minutos.
      `,
      contact: {
        name: "Suporte InvestAlerta",
        email: "suporte@investalerta.com.br",
      },
      license: {
        name: "Proprietary",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de desenvolvimento",
      },
      {
        url: "https://api.investalerta.com.br",
        description: "Servidor de producao",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Endpoints de verificacao de saude da API",
      },
      {
        name: "Auth",
        description: "Autenticacao e gerenciamento de usuarios",
      },
      {
        name: "Assets",
        description: "Busca e informacoes de ativos financeiros",
      },
      {
        name: "Watchlist",
        description: "Lista de ativos monitorados pelo usuario",
      },
      {
        name: "Alerts",
        description: "Gerenciamento de alertas de preco",
      },
      {
        name: "Notifications",
        description: "Configuracao de notificacoes push",
      },
      {
        name: "Summary",
        description: "Resumo diario e noticias",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtido no login",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Mensagem de erro",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  example: "healthy",
                },
                timestamp: {
                  type: "string",
                  format: "date-time",
                },
                version: {
                  type: "string",
                  example: "1.0.0",
                },
                uptime: {
                  type: "number",
                  example: 12345,
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            email: {
              type: "string",
              format: "email",
            },
            name: {
              type: "string",
            },
            plan: {
              type: "string",
              enum: ["FREE", "INTERMEDIATE", "GOLD"],
            },
            notificationsEnabled: {
              type: "boolean",
            },
            dailySummaryEnabled: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Asset: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            ticker: {
              type: "string",
              example: "PETR4",
            },
            name: {
              type: "string",
              example: "Petrobras PN",
            },
            type: {
              type: "string",
              enum: ["STOCK", "FII", "CRYPTO"],
            },
            lastPrice: {
              type: "number",
              example: 38.45,
            },
            priceUpdatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Alert: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            assetId: {
              type: "string",
              format: "uuid",
            },
            condition: {
              type: "string",
              enum: ["ABOVE", "BELOW"],
            },
            targetPrice: {
              type: "number",
              example: 40.0,
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE", "TRIGGERED"],
            },
            lastTriggeredAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
