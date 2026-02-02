import type { Env } from '../types/env';

export type QuoteResponse = {
  ticker: string;
  price: number;
  quotedAt: string;
  source: string;
  nameShort?: string | null;
};

type AssetType = 'ACAO' | 'FII' | 'CRIPTO';

export class MarketDataService {
  constructor(private readonly env: Env) {}

  async fetchQuote(tickerRaw: string, tipo: AssetType = 'ACAO'): Promise<QuoteResponse | null> {
    const ticker = tickerRaw.trim().toUpperCase();

    if (tipo === 'CRIPTO') {
      return this.fetchCryptoQuote(ticker);
    }

    return this.fetchBrapiQuote(ticker);
  }

  private async fetchBrapiQuote(ticker: string): Promise<QuoteResponse | null> {
    const endpoint = new URL('https://brapi.dev/api/quote/' + encodeURIComponent(ticker));
    if (this.env.BRAPI_TOKEN) endpoint.searchParams.set('token', this.env.BRAPI_TOKEN);

    const res = await fetch(endpoint.toString(), {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) return null;

    const json: any = await res.json();
    const result = json?.results?.[0];
    const price = Number(result?.regularMarketPrice ?? result?.price);
    if (!Number.isFinite(price)) return null;

    const quotedAt = result?.regularMarketTime
      ? new Date(result.regularMarketTime * 1000).toISOString()
      : new Date().toISOString();

    return {
      ticker,
      price,
      quotedAt,
      source: 'BRAPI',
      nameShort: result?.shortName ?? result?.longName ?? null,
    };
  }

  private async fetchCryptoQuote(ticker: string): Promise<QuoteResponse | null> {
    const symbol = this.mapCryptoTickerToSymbol(ticker);
    const url = 'https://api.binance.com/api/v3/ticker/price?symbol=' + encodeURIComponent(symbol);

    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;

    const json: any = await res.json();
    const price = Number(json?.price);
    if (!Number.isFinite(price)) return null;

    return {
      ticker,
      price,
      quotedAt: new Date().toISOString(),
      source: 'BINANCE',
      nameShort: ticker,
    };
  }

  private mapCryptoTickerToSymbol(ticker: string): string {
    const t = ticker.toUpperCase();
    if (t.endsWith('USDT')) return t;

    switch (t) {
      case 'BTC':
        return 'BTCUSDT';
      case 'ETH':
        return 'ETHUSDT';
      case 'SOL':
        return 'SOLUSDT';
      default:
        return t + 'USDT';
    }
  }
}
