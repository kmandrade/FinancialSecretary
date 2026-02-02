import type { Router } from '../lib/router';
import { jsonResponse } from '../lib/http';
import { buildOpenApiSpec } from '../docs/openapi';
import { swaggerHtml } from '../docs/swagger';

export function registerDocsController(router: Router) {
  router.get('/api/v1/openapi.json', (ctx) => {
    const url = new URL(ctx.req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const spec = buildOpenApiSpec(baseUrl);
    return jsonResponse(spec, 200);
  });

  router.get('/api/v1/docs', (ctx) => {
    const url = new URL(ctx.req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const html = swaggerHtml(`${baseUrl}/api/v1/openapi.json`);
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8'
      }
    });
  });
}
