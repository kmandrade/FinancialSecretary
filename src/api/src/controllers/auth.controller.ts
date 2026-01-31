// Controller para endpoints de autenticacao

import { Env } from '../types/env';
import { jsonResponse, errorResponse } from '../lib/http';
import { UserService } from '../services/user.service';
import { createUserRepository } from '../repositories/user.repository';
import { BadRequestError } from '../lib/errors';

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// POST /api/v1/auth/register
export async function register(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  let body: RegisterBody;
  
  try {
    body = await request.json();
  } catch {
    return errorResponse('Body invalido', 400, ctx.requestId);
  }

  const repository = createUserRepository(env);
  const service = new UserService(repository, env.JWT_SECRET);

  const result = await service.register({
    email: body.email,
    name: body.name,
    password: body.password,
  });

  return jsonResponse(result, 201, ctx.requestId);
}

// POST /api/v1/auth/login
export async function login(
  request: Request,
  env: Env,
  ctx: { params: Record<string, string>; query: Record<string, string>; requestId: string }
): Promise<Response> {
  let body: LoginBody;
  
  try {
    body = await request.json();
  } catch {
    return errorResponse('Body invalido', 400, ctx.requestId);
  }

  const repository = createUserRepository(env);
  const service = new UserService(repository, env.JWT_SECRET);

  const result = await service.login({
    email: body.email,
    password: body.password,
  });

  return jsonResponse(result, 200, ctx.requestId);
}
