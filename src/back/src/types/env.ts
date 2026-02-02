export interface Env {
  DB: D1Database;

  ENV: string;
  API_BASE_PATH: string;

  PRICE_POLL_INTERVAL_MIN: string;
  NEWS_COLLECTION_HOUR_UTC: string;
  DIGEST_CHECK_INTERVAL_MIN: string;

  JWT_SECRET?: string;
  JWT_ISSUER?: string;

  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;

  BRAPI_API_KEY?: string;

  BRAPI_TOKEN?: string;

  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  PUSH_SUBJECT?: string;

  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;

  APP_BASE_URL?: string;

  TERMS_VERSION?: string;
  TERMS_URL?: string;
  CONTACT_EMAIL?: string;
  DEFAULT_TIMEZONE?: string;
}

export interface AuthUser {
  id: string;
  perfil: 'USUARIO' | 'ADMIN';
  email: string;
  nome: string;
}

export interface RequestContext {
  requestId: string;
  req: Request;
  env: Env;
  params: Record<string, string>;
  query: Record<string, string>;
  user?: AuthUser;
}
