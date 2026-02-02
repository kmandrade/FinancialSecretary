import type { Middleware } from '../lib/router';

export const corsMiddleware: Middleware = async (ctx, next) => {
  const origin = ctx.req.headers.get('origin') || '*';

  const headers = new Headers();
  headers.set('access-control-allow-origin', origin);
  headers.set('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('access-control-allow-headers', 'content-type,authorization,x-admin-key');
  headers.set('access-control-max-age', '86400');
  headers.set('access-control-allow-credentials', 'true');

  if (ctx.req.method.toUpperCase() === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const res = await next();
  const merged = new Headers(res.headers);
  headers.forEach((v, k) => merged.set(k, v));

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: merged
  });
};
