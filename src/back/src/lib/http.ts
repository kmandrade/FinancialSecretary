import { z } from 'zod';

export type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export function jsonResponse(body: Json, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has('content-type')) headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function errorResponse(status: number, message: string, details?: unknown) {
  return jsonResponse({ success: false, message, details }, { status });
}

export async function parseJson<T>(req: Request, schema: z.ZodSchema<T>) {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new HttpError(400, 'Validation error', parsed.error.flatten());
  }
  return parsed.data;
}

export function paginate(page: number, pageSize: number) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeSize = Number.isFinite(pageSize) && pageSize > 0 && pageSize <= 100 ? Math.floor(pageSize) : 20;
  const offset = (safePage - 1) * safeSize;
  return { page: safePage, pageSize: safeSize, offset, limit: safeSize };
}

export function paginatedResponse<T>(items: T[], total: number, page: number, pageSize: number) {
  const pages = Math.ceil(total / pageSize);
  return jsonResponse({
    success: true,
    data: items,
    pagination: { page, pageSize, total, pages }
  });
}

export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
