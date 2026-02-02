export async function sha256Hex(input: string) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const buf = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function nowIso() {
  return new Date().toISOString();
}
