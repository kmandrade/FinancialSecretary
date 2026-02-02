# FinancialSecretaryWorker - Patch 2

Este zip contém **apenas os arquivos novos/alterados** para completar o Worker como API principal:

- Jobs (polling de preço, coleta de notícias, digest e dispatch de notificações)
- Registro das rotas faltantes no `src/index.ts`
- Controllers: `dashboard`, `notifications`, `news`, `digest`, `admin`
- Correções em `preferences.repository` (soft-delete)
- Repo + service de notifications com `listPendingMessages` e `revoke` por id
- Email service com `sendNotificationEmail`
- OpenAPI atualizado (Swagger)
- `dev.vars.example` alinhado com variáveis usadas

## Como incorporar no seu projeto

> Supondo que seu projeto base já está com a pasta `src/worker` (ou equivalente).

1) **Descompacte este zip por cima** da pasta do Worker.
   - Se o Windows perguntar para substituir arquivos, confirme.

2) Garanta que você está dentro da pasta do worker:

```bash
cd src\worker
```

3) Crie o arquivo `dev.vars` copiando do exemplo:

```bash
copy dev.vars.example dev.vars
```

4) Rode as migrações (schema novo):

```bash
npm run db:migrate:remote
```

5) Suba o worker local (com D1 remoto habilitado no wrangler):

```bash
npm run dev
```

6) Abra o Swagger:

- `http://127.0.0.1:8787/api/v1/docs`
- OpenAPI JSON: `http://127.0.0.1:8787/api/v1/openapi.json`

## Jobs

- Polling de preços: a cada 15 min (cron `*/15 * * * *`)
- Coleta de notícias + digest check: a cada hora (cron `0 * * * *`)
- Coleta “diária” extra: `10 11 * * *` (UTC)

