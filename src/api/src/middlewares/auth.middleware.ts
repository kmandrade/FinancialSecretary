// Middleware de autenticacao JWT

import { Env } from '../types/env';
import { verifyJWT, extractBearerToken, JWTPayload } from '../lib/jwt';
import { errorResponse } from '../lib/http';

// Extender Request com dados do usuario
declare global {
  interface Request {
    user?: JWTPayload;
  }
}

export async function authMiddleware(
  request: Request,
  env: Env,
  ctx: { requestId: string }
): Promise<Request | Response> {
  const authHeader = request.headers.get('Authorization');
  const token = extractBearerToken(authHeader);

  if (!token) {
    return errorResponse('Token de autenticacao nao fornecido', 401, ctx.requestId);
  }

  const payload = await verifyJWT(token, env.JWT_SECRET);
  
  if (!payload) {
    return errorResponse('Token invalido ou expirado', 401, ctx.requestId);
  }

  // Adicionar dados do usuario ao request
  // Como Request e imutavel, criamos um novo com os dados
  const newRequest = new Request(request, {
    headers: new Headers(request.headers),
  });
  
  // Armazenar user no header customizado (workaround para Workers)
  newRequest.headers.set('X-User-Id', payload.sub);
  newRequest.headers.set('X-User-Email', payload.email);
  newRequest.headers.set('X-User-Name', payload.name);
  newRequest.headers.set('X-User-Plan', payload.plan);

  return newRequest;
}

// Helper para extrair dados do usuario do request
export function getUserFromRequest(request: Request): JWTPayload | null {
  const id = request.headers.get('X-User-Id');
  const email = request.headers.get('X-User-Email');
  const name = request.headers.get('X-User-Name');
  const plan = request.headers.get('X-User-Plan');

  if (!id || !email || !name || !plan) {
    return null;
  }

  return {
    sub: id,
    email,
    name,
    plan,
    iat: 0,
    exp: 0,
  };
}
