import type { Env } from '../types/env';
import { buildPushHTTPRequest } from '@pushforge/builder';

export type WebPushSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export class PushService {
  constructor(private readonly env: Env) {}

  private getAdminContact(): string {
    const c = this.env.PUSH_SUBJECT || this.env.CONTACT_EMAIL || '';
    if (!c) return 'mailto:admin@example.com';
    if (c.startsWith('mailto:') || c.startsWith('https://') || c.startsWith('http://')) return c;
    if (c.includes('@')) return `mailto:${c}`;
    return c;
  }

  private parsePrivateJwk(): any {
    if (!this.env.VAPID_PRIVATE_KEY) throw new Error('VAPID_PRIVATE_KEY not configured');
    try {
      return JSON.parse(this.env.VAPID_PRIVATE_KEY);
    } catch {
      throw new Error('VAPID_PRIVATE_KEY must be a JSON JWK string');
    }
  }

  async send(params: {
    subscription: WebPushSubscription;
    payload: unknown;
    ttlSeconds?: number;
  }): Promise<{ ok: boolean; status: number; responseText?: string }> {
    const privateJWK = this.parsePrivateJwk();

    const subscription = {
      endpoint: params.subscription.endpoint,
      keys: {
        p256dh: params.subscription.p256dh,
        auth: params.subscription.auth
      }
    };

    const { endpoint, headers, body } = await buildPushHTTPRequest({
      privateJWK,
      subscription,
      message: {
        payload: params.payload,
        adminContact: this.getAdminContact(),
        ttl: params.ttlSeconds ?? 900
      } as any
    } as any);

    const res = await fetch(endpoint, { method: 'POST', headers, body });
    const text = await res.text().catch(() => undefined);

    return { ok: res.ok, status: res.status, responseText: text };
  }
}
