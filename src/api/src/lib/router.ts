// Router simples para Cloudflare Workers
import { Env } from '../types/env';
import { errorResponse, optionsResponse } from './http';
import { logger, generateRequestId } from './logger';
import { AppError, isOperationalError, ValidationError } from './errors';

export type RouteHandler = (
  request: Request,
  env: Env,
  ctx: { 
    params: Record<string, string>;
    query: Record<string, string>;
    requestId: string;
  }
) => Promise<Response>;

export type Middleware = (
  request: Request,
  env: Env,
  ctx: { requestId: string }
) => Promise<Request | Response>;

interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
  middlewares: Middleware[];
}

export class Router {
  private routes: Route[] = [];
  private globalMiddlewares: Middleware[] = [];

  // Adicionar middleware global
  use(middleware: Middleware) {
    this.globalMiddlewares.push(middleware);
  }

  // Metodos HTTP
  get(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute('GET', path, handler, middlewares);
  }

  post(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute('POST', path, handler, middlewares);
  }

  put(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute('PUT', path, handler, middlewares);
  }

  patch(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute('PATCH', path, handler, middlewares);
  }

  delete(path: string, handler: RouteHandler, middlewares: Middleware[] = []) {
    this.addRoute('DELETE', path, handler, middlewares);
  }

  private addRoute(
    method: string, 
    path: string, 
    handler: RouteHandler,
    middlewares: Middleware[] = []
  ) {
    const { pattern, paramNames } = this.pathToRegex(path);
    this.routes.push({ method, pattern, paramNames, handler, middlewares });
  }

  private pathToRegex(path: string): { pattern: RegExp; paramNames: string[] } {
    const paramNames: string[] = [];
    const regexPath = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    return {
      pattern: new RegExp(`^${regexPath}$`),
      paramNames,
    };
  }

  async handle(request: Request, env: Env): Promise<Response> {
    const requestId = generateRequestId();
    const log = logger.child(requestId);
    
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    log.info(`${method} ${path}`, { 
      userAgent: request.headers.get('user-agent'),
    });

    // Preflight CORS
    if (method === 'OPTIONS') {
      return optionsResponse();
    }

    // Executar middlewares globais
    let currentRequest = request;
    for (const middleware of this.globalMiddlewares) {
      const result = await middleware(currentRequest, env, { requestId });
      if (result instanceof Response) {
        return result;
      }
      currentRequest = result;
    }

    // Encontrar rota
    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = path.match(route.pattern);
      if (!match) continue;

      // Extrair parametros
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });

      // Query params
      const query: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      // Executar middlewares da rota
      for (const middleware of route.middlewares) {
        const result = await middleware(currentRequest, env, { requestId });
        if (result instanceof Response) {
          return result;
        }
        currentRequest = result;
      }

      try {
        const response = await route.handler(currentRequest, env, { 
          params, 
          query,
          requestId,
        });
        
        const duration = Date.now();
        log.info(`${method} ${path} -> ${response.status}`, { duration });
        
        return response;
      } catch (error) {
        return this.handleError(error, requestId, log);
      }
    }

    // Rota nao encontrada
    log.warn(`Rota nao encontrada: ${method} ${path}`);
    return errorResponse(`Rota ${method} ${path} nao encontrada`, 404, requestId);
  }

  private handleError(
    error: unknown, 
    requestId: string,
    log: typeof logger
  ): Response {
    // Erro de validacao
    if (error instanceof ValidationError) {
      log.warn('Erro de validacao', { errors: error.errors });
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          details: error.errors,
          requestId,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Erro operacional conhecido
    if (isOperationalError(error)) {
      log.warn(error.message, { code: error.code });
      return errorResponse(error.message, error.statusCode, requestId);
    }

    // Erro desconhecido
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    const stack = error instanceof Error ? error.stack : undefined;
    log.error('Erro interno', { message, stack });
    
    return errorResponse('Erro interno do servidor', 500, requestId);
  }
}
