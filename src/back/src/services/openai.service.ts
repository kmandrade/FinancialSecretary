import type { Env } from '../types/env';

export class OpenAIService {
  constructor(private env: Env) {}

  hasKey() {
    return !!this.env.OPENAI_API_KEY;
  }

  async summarizeDailyDigest(input: {
    tickers: string[];
    items: Array<{ titulo: string; trecho?: string | null; fonte?: string | null }>;
    language?: 'pt' | 'en';
  }): Promise<{ summary: string; bullets: string[] }> {
    if (!this.env.OPENAI_API_KEY) {
      const bullets = input.items.slice(0, 8).map((x) => x.titulo);
      const summary = bullets.slice(0, 5).join('\n');
      return { summary, bullets };
    }

    const model = this.env.OPENAI_MODEL || 'gpt-4o-mini';

    const system = input.language === 'en'
      ? 'You are a helpful assistant that summarizes financial news for retail investors. Be concise and factual.'
      : 'Você é um assistente que resume notícias financeiras para investidores pessoa física. Seja conciso e factual.';

    const prompt = {
      tickers: input.tickers,
      items: input.items.slice(0, 12)
    };

    const body = {
      model,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content:
            (input.language === 'en'
              ? 'Summarize the following news into 3-10 headlines and bullet points. Return JSON with fields: summary (string) and bullets (array of strings).'
              : 'Resuma as notícias abaixo em 3-10 manchetes e bullets de pontos principais. Retorne JSON com os campos: summary (string) e bullets (array de strings).')
            + '\n\n' + JSON.stringify(prompt)
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const t = await res.text();
      const bullets = input.items.slice(0, 8).map((x) => x.titulo);
      return { summary: (t || '').slice(0, 400), bullets };
    }

    const data: any = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    try {
      const parsed = JSON.parse(content);
      const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
      const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.filter((x: any) => typeof x === 'string').slice(0, 12) : [];
      return { summary, bullets };
    } catch {
      const bullets = input.items.slice(0, 8).map((x) => x.titulo);
      return { summary: String(content || '').slice(0, 600), bullets };
    }
  }
}
