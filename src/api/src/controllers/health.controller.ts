// Controller para endpoints de health check (Cloudflare Workers)

import { Env } from '../types/env';
import { jsonResponse } from '../lib/http';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
  checks: {
    database: 'ok' | 'error';
  };
}

const startTime = Date.now();

// GET /api/v1/health
export async function healthCheck(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  let dbStatus: 'ok' | 'error' = 'ok';

  try {
    // Testar conexao com D1
    await env.DB.prepare('SELECT 1').first();
  } catch {
    dbStatus = 'error';
  }

  const status: HealthStatus = {
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    version: env.API_VERSION || 'v1',
    environment: env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: dbStatus,
    },
  };

  return jsonResponse(status, status.status === 'ok' ? 200 : 503, ctx.requestId);
}

// GET /api/v1/health/live
export async function livenessCheck(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  return jsonResponse({ status: 'alive', timestamp: new Date().toISOString() }, 200, ctx.requestId);
}

// GET /api/v1/health/ready
export async function readinessCheck(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  try {
    await env.DB.prepare('SELECT 1').first();
    return jsonResponse({ status: 'ready' }, 200, ctx.requestId);
  } catch {
    return jsonResponse({ status: 'not_ready', error: 'Database unavailable' }, 503, ctx.requestId);
  }
}
