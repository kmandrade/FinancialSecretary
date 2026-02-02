import type { Router } from '../lib/router';
import { jsonResponse, parseJson } from '../lib/http';
import { z } from 'zod';
import { PreferencesRepository } from '../repositories/preferences.repository';
import { requireUser } from './_helpers';

const UpdateSchema = z.object({
  fuso_horario: z.string().optional(),
  resumo_diario_ativo: z.boolean().optional(),
  horario_resumo: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  canal_padrao_noticias: z.enum(['PUSH', 'EMAIL', 'AMBOS']).optional(),
  alerta_aviso_push_obrigatorio: z.boolean().optional()
});

export function registerPreferencesController(router: Router) {
  router.get('/api/v1/preferences', async (ctx) => {
    const user = requireUser(ctx);
    const repo = new PreferencesRepository(ctx.env.DB);
    await repo.ensureDefaults(user.id);
    const preferences = await repo.getByUserId(user.id);
    return jsonResponse({ preferences });
  });

  router.put('/api/v1/preferences', async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, UpdateSchema);
    const repo = new PreferencesRepository(ctx.env.DB);
    await repo.ensureDefaults(user.id);
    await repo.update(user.id, {
      fuso_horario: body.fuso_horario,
      resumo_diario_ativo: body.resumo_diario_ativo === undefined ? undefined : body.resumo_diario_ativo ? 1 : 0,
      horario_resumo: body.horario_resumo,
      canal_padrao_noticias: body.canal_padrao_noticias,
      alerta_aviso_push_obrigatorio: body.alerta_aviso_push_obrigatorio === undefined ? undefined : body.alerta_aviso_push_obrigatorio ? 1 : 0
    });

    const preferences = await repo.getByUserId(user.id);
    return jsonResponse({ preferences });
  });
}
