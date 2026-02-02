import { webcrypto as crypto } from 'node:crypto';

function base64urlEncode(bytes) {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64urlToBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, 'base64');
}

const { privateKey, publicKey } = await crypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' },
  true,
  ['sign', 'verify']
);

const privateJwk = await crypto.subtle.exportKey('jwk', privateKey);
const publicJwk = await crypto.subtle.exportKey('jwk', publicKey);

const x = base64urlToBytes(publicJwk.x);
const y = base64urlToBytes(publicJwk.y);
const uncompressed = Buffer.concat([Buffer.from([0x04]), x, y]);
const vapidPublic = base64urlEncode(uncompressed);

console.log('VAPID_PUBLIC_KEY=' + vapidPublic);
console.log('VAPID_PRIVATE_KEY=' + JSON.stringify(privateJwk));
