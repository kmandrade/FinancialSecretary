import type { Middleware } from '../lib/router';
import { AppError } from '../lib/errors';
import { HttpError, jsonResponse } from '../lib/http';

export const errorMiddleware: Middleware = async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    if (err instanceof AppError) {
      return jsonResponse(
        {
          error: {
            code: err.code,
            message: err.message
          }
        },
        err.status
      );
    }

    if (err instanceof HttpError) {
      return jsonResponse(
        {
          error: {
            code: 'http_error',
            message: err.message
          }
        },
        err.status
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse(
      {
        error: {
          code: 'internal_error',
          message: 'Erro interno.'
        },
        debug: ctx.env.ENV === 'dev' ? message : undefined
      },
      500
    );
  }
};
