// Utilidades HTTP para Cloudflare Workers

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Headers CORS padrao
export function corsHeaders(origin: string = '*'): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Resposta de sucesso
export function jsonResponse<T>(
  data: T, 
  status: number = 200,
  requestId?: string
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    requestId,
  };
  
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

// Resposta de erro
export function errorResponse(
  message: string, 
  status: number = 500,
  requestId?: string,
  details?: unknown
): Response {
  const body: ApiResponse = {
    success: false,
    error: message,
    requestId,
  };
  
  if (details && process.env.NODE_ENV !== 'production') {
    (body as Record<string, unknown>).details = details;
  }
  
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

// Resposta paginada
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  requestId?: string
): Response {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    requestId,
  };
  
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
  });
}

// Resposta OPTIONS para CORS preflight
export function optionsResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// Parser de query string
export function parseQueryParams(url: URL): Record<string, string> {
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

// Parser de path params
export function parsePathParams(
  pattern: string, 
  path: string
): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  
  if (patternParts.length !== pathParts.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  
  return params;
}
