import type { Middleware } from '../lib/router';
import { verifyAccessToken } from '../lib/jwt';
import { UserRepository } from '../repositories/user.repository';

export const authMiddleware: Middleware = async (ctx, next) => {
  const auth = ctx.req.headers.get('authorization') || ctx.req.headers.get('Authorization') || '';
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : null;

  const secret = ctx.env.JWT_SECRET;
  if (token && secret) {
    try {
      const issuer = ctx.env.JWT_ISSUER || 'financialsecretary';
      const payload = await verifyAccessToken(token, secret, issuer);

      const userId = typeof payload.sub === 'string' ? payload.sub : null;
      if (userId) {
        const userRepo = new UserRepository(ctx.env.DB);
        const user = await userRepo.getById(userId);
        if (user && !user.excluido_em) {
          ctx.user = {
            id: user.id,
            perfil: user.perfil,
            email: user.email,
            nome: user.nome
          };
        }
      }
    } catch {
      // token inválido -> segue como não autenticado
    }
  }

  return await next();
};
