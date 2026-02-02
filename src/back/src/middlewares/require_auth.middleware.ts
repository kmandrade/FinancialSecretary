import type { Middleware } from '../lib/router';
import { UnauthorizedError } from '../lib/errors';

const PUBLIC_PATHS = new Set([
  '/',
  '/api/v1/health',
  '/api/v1/docs',
  '/api/v1/openapi.json',
  '/api/v1/plans',
  '/api/v1/terms/current',
  '/api/v1/auth/register',
  '/api/v1/auth/login',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password'
]);

export const requireAuthMiddleware: Middleware = async (ctx, next) => {
  const pathname = new URL(ctx.req.url).pathname;
  if (PUBLIC_PATHS.has(pathname)) {
    return await next();
  }

  if (pathname.startsWith('/api/v1/') && !ctx.user) {
    throw new UnauthorizedError();
  }

  return await next();
};
