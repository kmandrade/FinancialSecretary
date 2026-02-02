import type { Env, RequestContext } from '../types/env';

export type Handler = (ctx: RequestContext) => Promise<Response> | Response;

// Eu recomendo permitir Response | Promise<Response> aqui também
export type Middleware = (
  ctx: RequestContext,
  next: () => Promise<Response>
) => Promise<Response> | Response;

type Route = {
  method: string;
  regex: RegExp;
  keys: string[];
  handler: Handler;
};

function compilePath(path: string) {
  const keys: string[] = [];

  const normalized = path === '/' ? '' : path.replace(/\/$/, '');

  const escaped = normalized
    .replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
    .replace(/\\\/:([A-Za-z0-9_]+)/g, (_m, key) => {
      keys.push(String(key));
      return '\\\/([^\\/]+)';
    });

  const regex = new RegExp(`^${escaped || ''}\\/?$`);
  return { regex, keys };
}

type StoredMiddleware = {
  fn: Middleware;
  name: string;
  addedAt?: string;
};

function describeValue(v: unknown) {
  const t = typeof v;
  if (v === null) return 'null';
  if (t === 'function') return `function ${(v as Function).name || '(anonymous)'}`;
  if (t !== 'object') return `${t}(${String(v)})`;

  const obj = v as Record<string, unknown>;
  const ctor = (obj as any)?.constructor?.name;
  const keys = Object.keys(obj);
  return `object${ctor ? `(${ctor})` : ''} keys=[${keys.slice(0, 8).join(', ')}${keys.length > 8 ? ', ...' : ''}]`;
}

export class Router {
  private routes: Route[] = [];
  private middlewares: StoredMiddleware[] = [];

  // aceita vários e também arrays (app.use([mw1, mw2]) ou app.use(mw1, mw2))
  use(...mws: Array<Middleware | Middleware[]>) {
    const flat = (mws as any[]).flat?.(Infinity) ?? ([] as any[]).concat(...(mws as any[]));

    for (const mw of flat) {
      if (typeof mw !== 'function') {
        throw new TypeError(
          `[Router.use] Middleware inválido: ${describeValue(mw)}\n` +
          `Dicas comuns: import errado (import * as X), array passado sem spread, factory chamada errado (mw()), ou router/objeto passado no lugar da função.`
        );
      }

      const stack = new Error().stack;
      // guarda só um pedacinho útil do stack
      const addedAt = stack ? stack.split('\n').slice(2, 7).join('\n') : undefined;

      this.middlewares.push({
        fn: mw,
        name: mw.name || '(anonymous)',
        addedAt,
      });
    }
    return this;
  }

  get(path: string, handler: Handler) { return this.add('GET', path, handler); }
  post(path: string, handler: Handler) { return this.add('POST', path, handler); }
  put(path: string, handler: Handler) { return this.add('PUT', path, handler); }
  patch(path: string, handler: Handler) { return this.add('PATCH', path, handler); }
  delete(path: string, handler: Handler) { return this.add('DELETE', path, handler); }
  options(path: string, handler: Handler) { return this.add('OPTIONS', path, handler); }

  private add(method: string, path: string, handler: Handler) {
    const { regex, keys } = compilePath(path);
    this.routes.push({ method, regex, keys, handler });
    return this;
  }

  async handle(req: Request, env: Env) {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();
    const pathname = url.pathname;

    const route = this.routes.find((r) => r.method === method && r.regex.test(pathname));
    if (!route) return new Response('Not found', { status: 404 });

    const match = pathname.match(route.regex);
    const params: Record<string, string> = {};
    if (match) {
      for (let i = 0; i < route.keys.length; i++) {
        params[route.keys[i]] = decodeURIComponent(match[i + 1]);
      }
    }

    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => { query[key] = value; });

    const ctx: RequestContext = {
      requestId: crypto.randomUUID(),
      req,
      env,
      params,
      query
    };

    let idx = -1;
    const dispatch = async (i: number): Promise<Response> => {
      if (i <= idx) throw new Error('Middleware chain error');
      idx = i;

      const stored = this.middlewares[i];
      if (stored !== undefined) {
        // redundância: se alguém empurrar lixo por fora (as any), a msg fica clara
        if (typeof stored.fn !== 'function') {
          throw new TypeError(
            `[Router.dispatch] Middleware corrompido no índice ${i}: ${describeValue(stored.fn)}`
          );
        }

        try {
          return await stored.fn(ctx, () => dispatch(i + 1));
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(
            `Erro no middleware #${i} (${stored.name}).\n` +
            (stored.addedAt ? `Registrado em:\n${stored.addedAt}\n` : '') +
            `Original: ${msg}`
          );
        }
      }

      return await Promise.resolve(route.handler(ctx));
    };

    return dispatch(0);
  }
}
