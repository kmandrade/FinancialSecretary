import { SignJWT, jwtVerify } from 'jose';

export type JwtPayload = {
  sub: string;
  perfil: 'USUARIO' | 'ADMIN';
  email: string;
  nome: string;
};

export async function signAccessToken(payload: JwtPayload, secret: string, issuer: string, expiresIn = '7d') {
  const key = new TextEncoder().encode(secret);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuer(issuer)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
  return jwt;
}

export async function verifyAccessToken(token: string, secret: string, issuer: string) {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, key, { issuer });
  return payload as unknown as JwtPayload & { iat: number; exp: number; iss: string; sub: string };
}
