export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
  sector: string;
}

export interface Alert {
  id: string;
  ticker: string;
  stockName: string;
  condition: "above" | "below";
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface AlertHistory {
  id: string;
  alertId: string;
  ticker: string;
  condition: "above" | "below";
  targetPrice: number;
  triggeredPrice: number;
  triggeredAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  tickers: string[];
  sentiment: "positive" | "negative" | "neutral";
}

export interface DailySummary {
  id: string;
  date: string;
  generatedAt: string;
  headlines: NewsItem[];
  keyPoints: string[];
  marketOverview: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "intermediate" | "gold";
  notificationsEnabled: boolean;
  dailySummaryTime: string;
  dailySummaryEnabled: boolean;
  watchlistLimit: number;
  createdAt: string;
}

export interface Plan {
  id: "free" | "intermediate" | "gold";
  name: string;
  price: number;
  watchlistLimit: number;
  hasAds: boolean;
  features: string[];
}
