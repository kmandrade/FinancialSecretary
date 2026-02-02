import type { RequestContext } from '../types/env';
import { UnauthorizedError, ForbiddenError } from './errors';

export function requireAuth(ctx: RequestContext) {
  if (!ctx.user) throw new UnauthorizedError('Você precisa estar autenticado.');
  return ctx.user;
}

export function requireAdmin(ctx: RequestContext) {
  const user = requireAuth(ctx);
  if (user.perfil !== 'ADMIN') throw new ForbiddenError('Acesso restrito a administradores.');
  return user;
}
