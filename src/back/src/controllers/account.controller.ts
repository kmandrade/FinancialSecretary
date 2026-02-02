import type { Router } from '../lib/router';
import { jsonResponse, parseJson } from '../lib/http';
import { z } from 'zod';
import { UserRepository } from '../repositories/user.repository';
import { PlanRepository } from '../repositories/plan.repository';
import { PreferencesRepository } from '../repositories/preferences.repository';
import { TermsRepository } from '../repositories/terms.repository';
import { requireUser } from './_helpers';

const updateMeSchema = z.object({
  nome: z.string().min(1).optional(),
  email: z.string().email().optional()
});

export function registerAccountController(router: Router) {
  router.get('/api/v1/me', async (ctx) => {
    const user = requireUser(ctx);
    const userRepo = new UserRepository(ctx.env.DB);
    const planRepo = new PlanRepository(ctx.env.DB);
    const prefsRepo = new PreferencesRepository(ctx.env.DB);
    const termsRepo = new TermsRepository(ctx.env.DB);

    const row = await userRepo.getById(user.id);
    if (!row || row.excluido_em) return jsonResponse({ error: { code: 'not_found', message: 'Usuário não encontrado.' } }, { status: 404 });

    const plan = await planRepo.getUserPlan(user.id);
    const prefs = await prefsRepo.getByUserId(user.id);
    const terms = await termsRepo.getLatestAcceptanceByUser(user.id);

    return jsonResponse(
      {
        user: { id: row.id, email: row.email, nome: row.nome, perfil: row.perfil, criado_em: row.criado_em },
        plano: plan,
        preferencias: prefs,
        termos: terms
      },
      { status: 200 }
    );
  });

  router.put('/api/v1/me', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, updateMeSchema);
    const userRepo = new UserRepository(ctx.env.DB);

    const current = await userRepo.getById(user.id);
    if (!current || current.excluido_em) return jsonResponse({ error: { code: 'not_found', message: 'Usuário não encontrado.' } }, { status: 404 });

    if (body.email && body.email !== current.email) {
      await userRepo.updateEmail(user.id, body.email);
    }
    if (body.nome && body.nome !== current.nome) {
      await userRepo.updateName(user.id, body.nome);
    }

    const updated = await userRepo.getById(user.id);

    return jsonResponse({ user: { id: updated!.id, email: updated!.email, nome: updated!.nome, perfil: updated!.perfil } }, { status: 200 });
  });

  router.delete('/api/v1/me', async (ctx) => {
    const user = requireUser(ctx);
    const userRepo = new UserRepository(ctx.env.DB);

    await userRepo.softDelete(user.id);

    return jsonResponse({ ok: true }, { status: 200 });
  });
}
