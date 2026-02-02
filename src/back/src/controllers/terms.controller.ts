import type { Router } from '../lib/router';
import { jsonResponse, parseJson } from '../lib/http';
import { z } from 'zod';
import { TermsRepository } from '../repositories/terms.repository';
import { TermsService } from '../services/terms.service';
import { requireUser, getClientIp, getUserAgent } from './_helpers';

const AcceptSchema = z.object({
  versao_termos: z.string().min(1),
  aceito: z.boolean(),
  observacoes: z.string().optional()
});

export function registerTermsController(router: Router) {
  router.get('/api/v1/terms/current', (ctx) => {
    const service = new TermsService(ctx.env, new TermsRepository(ctx.env.DB));
    return jsonResponse({ terms: service.currentTerms() });
  });

  router.post('/api/v1/terms/accept', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, AcceptSchema);
    const service = new TermsService(ctx.env, new TermsRepository(ctx.env.DB));

    await service.acceptTerms(user.id, {
      versao_termos: body.versao_termos,
      aceito: body.aceito,
      ip: getClientIp(ctx.req),
      user_agent: getUserAgent(ctx.req),
      observacoes: body.observacoes
    });

    return jsonResponse({ ok: true });
  });
}
