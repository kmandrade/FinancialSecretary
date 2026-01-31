// Tipos para o ambiente do Cloudflare Worker

export interface Env {
  // D1 Database binding
  DB: D1Database;
  
  // Environment variables
  ENVIRONMENT: string;
  API_VERSION: string;
  CORS_ORIGIN: string;
  
  // JWT Secret (adicionar via wrangler secret put JWT_SECRET)
  JWT_SECRET: string;
  
  // BRAPI Token para precos (adicionar via wrangler secret)
  BRAPI_TOKEN?: string;
}

// Tipo para contexto de execucao do Worker
export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
