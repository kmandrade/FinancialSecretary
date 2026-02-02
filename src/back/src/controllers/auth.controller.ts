import type { Router } from '../lib/router';
import { jsonResponse, parseJson } from '../lib/http';
import { z } from 'zod';
import { UserRepository } from '../repositories/user.repository';
import { PlanRepository } from '../repositories/plan.repository';
import { PreferencesRepository } from '../repositories/preferences.repository';
import { TermsRepository } from '../repositories/terms.repository';
import { PasswordResetRepository } from '../repositories/password_reset.repository';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { getClientIp, getUserAgent } from './_helpers';

const registerSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
  nome: z.string().min(1),
  aceitou_termos: z.boolean()
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1)
});

const forgotSchema = z.object({
  email: z.string().email()
});

const resetSchema = z.object({
  token: z.string().min(10),
  nova_senha: z.string().min(6)
});

function buildAuthService(ctx: any) {
  const userRepo = new UserRepository(ctx.env.DB);
  const planRepo = new PlanRepository(ctx.env.DB);
  const prefsRepo = new PreferencesRepository(ctx.env.DB);
  const termsRepo = new TermsRepository(ctx.env.DB);
  const resetRepo = new PasswordResetRepository(ctx.env.DB);
  const emailService = new EmailService(ctx.env);
  return new AuthService(ctx.env, userRepo, prefsRepo, termsRepo, planRepo, resetRepo, emailService);
}

export function registerAuthController(router: Router) {
  router.post('/api/v1/auth/register', async (ctx) => {
    const body = await parseJson(ctx.req, registerSchema);
    const service = buildAuthService(ctx);
    const { user, token } = await service.register({
      email: body.email,
      senha: body.senha,
      nome: body.nome,
      termos_versao: ctx.env.TERMS_VERSION || 'v1',
      termos_aceito: body.aceitou_termos,
      ip: getClientIp(ctx.req),
      user_agent: getUserAgent(ctx.req)
    });

    return jsonResponse({ user, token },  { status: 200 });
  });

  router.post('/api/v1/auth/login', async (ctx) => {
    const body = await parseJson(ctx.req, loginSchema);
    const service = buildAuthService(ctx);
    const { user, token } = await service.login({ email: body.email, senha: body.senha });
    return jsonResponse({ user, token },  { status: 200 });
  });

  router.post('/api/v1/auth/forgot-password', async (ctx) => {
    const body = await parseJson(ctx.req, forgotSchema);
    const service = buildAuthService(ctx);
    const resetUrlBase = `${(ctx.env.APP_BASE_URL || new URL(ctx.req.url).origin).replace(/\/$/, '')}/reset-password`;
    const result = await service.forgotPassword({ email: body.email, resetUrlBase });
    return jsonResponse(result,  { status: 200 });
  });

  router.post('/api/v1/auth/reset-password', async (ctx) => {
    const body = await parseJson(ctx.req, resetSchema);
    const service = buildAuthService(ctx);
    const result = await service.resetPassword({ token: body.token, newPassword: body.nova_senha });
    return jsonResponse(result,  { status: 200 });
  });
}
