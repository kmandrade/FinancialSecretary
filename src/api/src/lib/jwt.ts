// JWT utilities para Cloudflare Workers
// Usa Web Crypto API disponivel nos Workers

export interface JWTPayload {
  sub: string;      // User ID
  email: string;
  name: string;
  plan: string;
  iat: number;      // Issued at
  exp: number;      // Expiration
}

// Encoder/Decoder base64url
function base64urlEncode(data: ArrayBuffer | string): string {
  const bytes = typeof data === 'string' 
    ? new TextEncoder().encode(data) 
    : new Uint8Array(data);
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const decoded = atob(base64 + padding);
  return Uint8Array.from(decoded, c => c.charCodeAt(0));
}

// Criar chave HMAC a partir do secret
async function getSigningKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Gerar JWT
export async function signJWT(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string,
  expiresIn: number = 7 * 24 * 60 * 60 // 7 dias em segundos
): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await getSigningKey(secret);
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(signingInput)
  );

  const encodedSignature = base64urlEncode(signature);
  return `${signingInput}.${encodedSignature}`;
}

// Verificar e decodificar JWT
export async function verifyJWT(
  token: string, 
  secret: string
): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    // Verificar assinatura
    const key = await getSigningKey(secret);
    const encoder = new TextEncoder();
    const signature = base64urlDecode(encodedSignature);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      encoder.encode(signingInput)
    );

    if (!isValid) {
      return null;
    }

    // Decodificar payload
    const payloadJson = new TextDecoder().decode(base64urlDecode(encodedPayload));
    const payload: JWTPayload = JSON.parse(payloadJson);

    // Verificar expiracao
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Extrair token do header Authorization
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Hash de senha usando PBKDF2 (disponivel no Web Crypto)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  
  // Formato: salt:hash (ambos em base64)
  const saltBase64 = base64urlEncode(salt);
  const hashBase64 = base64urlEncode(hash);
  return `${saltBase64}:${hashBase64}`;
}

// Verificar senha
export async function verifyPassword(
  password: string, 
  storedHash: string
): Promise<boolean> {
  try {
    const [saltBase64, hashBase64] = storedHash.split(':');
    const salt = base64urlDecode(saltBase64);
    
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    const hash = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );
    
    const computedHashBase64 = base64urlEncode(hash);
    return computedHashBase64 === hashBase64;
  } catch {
    return false;
  }
}
