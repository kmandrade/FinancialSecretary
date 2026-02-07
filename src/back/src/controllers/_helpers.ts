import type { RequestContext } from '../types/env';
import { AppError } from '../lib/errors';

export function requireUser(ctx: RequestContext) {
  if (!ctx.user) throw new AppError(401, 'Não autenticado.',"Não autenticado");
  return ctx.user;
}

export function getClientIp(req: Request): string | null {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    null
  );
}

export function getUserAgent(req: Request): string | null {
  return req.headers.get('user-agent') || null;
}
