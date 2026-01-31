// Controller para endpoints de usuario

import { Env } from '../types/env';
import { jsonResponse, errorResponse } from '../lib/http';
import { UserService } from '../services/user.service';
import { createUserRepository } from '../repositories/user.repository';
import { getUserFromRequest } from '../middlewares/auth.middleware';
import { UnauthorizedError } from '../lib/errors';

// GET /api/v1/users/me
export async function getMe(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new UnauthorizedError('Usuario nao autenticado');
  }

  const repository = createUserRepository(env);
  const service = new UserService(repository, env.JWT_SECRET);

  const userData = await service.getById(user.sub);
  return jsonResponse(userData, 200, ctx.requestId);
}

// PATCH /api/v1/users/me
export async function updateMe(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new UnauthorizedError('Usuario nao autenticado');
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Body invalido', 400, ctx.requestId);
  }

  const repository = createUserRepository(env);
  const service = new UserService(repository, env.JWT_SECRET);

  const userData = await service.update(user.sub, {
    name: typeof body.name === 'string' ? body.name : undefined,
    notificationsEnabled: typeof body.notificationsEnabled === 'boolean' ? body.notificationsEnabled : undefined,
    dailySummaryEnabled: typeof body.dailySummaryEnabled === 'boolean' ? body.dailySummaryEnabled : undefined,
    dailySummaryTime: typeof body.dailySummaryTime === 'string' ? body.dailySummaryTime : undefined,
  });

  return jsonResponse(userData, 200, ctx.requestId);
}

// DELETE /api/v1/users/me
export async function deleteMe(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new UnauthorizedError('Usuario nao autenticado');
  }

  const repository = createUserRepository(env);
  const service = new UserService(repository, env.JWT_SECRET);

  await service.delete(user.sub);
  return jsonResponse({ message: 'Usuario deletado com sucesso' }, 200, ctx.requestId);
}
