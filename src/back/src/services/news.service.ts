import { XMLParser } from 'fast-xml-parser';
import type { Env } from '../types/env';
import { sha256Hex } from '../lib/crypto';
import { AssetRepository } from '../repositories/asset.repository';
import { NewsRepository } from '../repositories/news.repository';

export type NewsCollectStats = { tickers: number; inserted: number; linked: number };

export class NewsService {
  constructor(private env: Env, private assetRepo: AssetRepository, private newsRepo: NewsRepository) {}

  async collectForTickers(tickers: string[], opts?: { hours?: number }):
    Promise<NewsCollectStats> {
    const hours = opts?.hours ?? 24;
    const uniq = Array.from(new Set(tickers.map((t) => t.trim().toUpperCase()).filter(Boolean)));

    let inserted = 0;
    let linked = 0;

    const parser = new XMLParser({ ignoreAttributes: false });

    for (const ticker of uniq) {
      const asset = await this.ensureAssetExists(ticker);
      if (!asset) continue;

      const url = this.buildGoogleNewsRssUrl(ticker, hours);
      const res = await fetch(url.toString(), { headers: { 'user-agent': 'FinancialSecretaryBot/1.0' } });
      if (!res.ok) continue;

      const xml = await res.text();
      const parsed: any = parser.parse(xml);
      const items = parsed?.rss?.channel?.item;
      const list = Array.isArray(items) ? items : items ? [items] : [];

      for (const it of list) {
        const title: string = it?.title || '';
        const link: string = it?.link || '';
        const pubDate: string | undefined = it?.pubDate;

        if (!title || !link) continue;

        const { titulo, fonte } = splitTitle(title);
        const hash = await sha256Hex(`${titulo}||${fonte || ''}`.toLowerCase());

        const insertedRow = await this.newsRepo.insertNews({
          url: link,
          fonte,
          titulo,
          trecho: it?.description ? String(it.description).slice(0, 500) : null,
          publicado_em: pubDate ? new Date(pubDate).toISOString() : null,
          hash_dedupe: hash
        });

        if (insertedRow.created) inserted++;

        await this.newsRepo.linkNewsToAsset(asset.id, insertedRow.id);
        linked++;
      }
    }

    return { tickers: uniq.length, inserted, linked };
  }

  async listNewsForTicker(ticker: string, limit = 20) {
    const asset = await this.assetRepo.getByTicker(ticker.trim().toUpperCase());
    if (!asset) return [];
    return await this.newsRepo.listNewsForAsset(asset.id, limit);
  }

  private buildGoogleNewsRssUrl(ticker: string, hours: number) {
    const query = `${ticker} when:${Math.max(1, Math.floor(hours / 24))}d`;
    const url = new URL('https://news.google.com/rss/search');
    url.searchParams.set('q', query);
    url.searchParams.set('hl', 'pt-BR');
    url.searchParams.set('gl', 'BR');
    url.searchParams.set('ceid', 'BR:pt-419');
    return url;
  }

  private async ensureAssetExists(ticker: string) {
    const existing = await this.assetRepo.getByTicker(ticker);
    if (existing) return existing;

    await this.assetRepo.upsertAsset({
      ticker,
      nome_curto: null,
      tipo: ['BTC', 'ETH', 'SOL'].includes(ticker) ? 'CRIPTO' : ticker.endsWith('11') ? 'FII' : 'ACAO',
      bolsa: ['BTC', 'ETH', 'SOL'].includes(ticker) ? 'GLOBAL' : 'B3'
    });

    return await this.assetRepo.getByTicker(ticker);
  }
}

function splitTitle(title: string) {
  const idx = title.lastIndexOf(' - ');
  if (idx > 0) {
    return { titulo: title.slice(0, idx).trim(), fonte: title.slice(idx + 3).trim() };
  }
  return { titulo: title.trim(), fonte: null as string | null };
}
