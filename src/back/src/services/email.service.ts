import type { Env } from '../types/env';

export class EmailService {
  constructor(private readonly env: Env) {}

  async sendPasswordResetEmail(params: {
    to: string;
    resetLink: string;
    nome?: string | null;
  }): Promise<void> {
    const subject = 'Redefinição de senha - InvestAlerta';
    const body = `Olá${params.nome ? ' ' + params.nome : ''}!\n\nUse o link abaixo para redefinir sua senha:\n${params.resetLink}\n\nSe você não solicitou, ignore este email.`;

    await this.sendRawEmail({ to: params.to, subject, body });
  }

  async sendDailyDigestEmail(params: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    await this.sendRawEmail({ to: params.to, subject: params.subject, body: params.body });
  }

  private async sendRawEmail(params: { to: string; subject: string; body: string }): Promise<void> {
    if (!this.env.RESEND_API_KEY) {
      console.log('[EmailService] RESEND_API_KEY ausente. Email não enviado.', {
        to: params.to,
        subject: params.subject,
      });
      return;
    }

    if (!this.env.EMAIL_FROM) {
      console.log('[EmailService] EMAIL_FROM ausente. Email não enviado.', {
        to: params.to,
        subject: params.subject,
      });
      return;
    }

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.env.EMAIL_FROM,
        to: params.to,
        subject: params.subject,
        text: params.body,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.log('[EmailService] Falha ao enviar email.', { status: resp.status, text });
    }
  }

  async sendNotificationEmail(params: {
    to: string;
    subject: string;
    html?: string | null;
    text?: string | null;
  }): Promise<{ id?: string | null; skipped?: boolean }> {
    if (!this.env.RESEND_API_KEY || !this.env.EMAIL_FROM) {
      return { skipped: true };
    }

    const payload = {
      from: this.env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html ?? (params.text ? `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre-wrap;">${params.text}</pre>` : undefined),
      text: params.text ?? undefined
    };

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const t = await r.text();
      throw new Error(`resend_error: ${r.status} ${t}`);
    }

    const data = await r.json<{ id?: string }>();
    return { id: data.id ?? null };
  }
}
