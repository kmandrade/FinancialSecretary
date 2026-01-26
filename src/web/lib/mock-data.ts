import type {
  Stock,
  Alert,
  AlertHistory,
  NewsItem,
  DailySummary,
  User,
  Plan,
} from "./types";

export const mockStocks: Stock[] = [
  {
    ticker: "PETR4",
    name: "Petrobras PN",
    price: 38.45,
    change: 0.85,
    changePercent: 2.26,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Petróleo e Gás",
  },
  {
    ticker: "VALE3",
    name: "Vale ON",
    price: 62.3,
    change: -1.2,
    changePercent: -1.89,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Mineração",
  },
  {
    ticker: "ITUB4",
    name: "Itaú Unibanco PN",
    price: 32.15,
    change: 0.45,
    changePercent: 1.42,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Bancos",
  },
  {
    ticker: "BBDC4",
    name: "Bradesco PN",
    price: 14.82,
    change: -0.18,
    changePercent: -1.2,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Bancos",
  },
  {
    ticker: "ABEV3",
    name: "Ambev ON",
    price: 12.45,
    change: 0.12,
    changePercent: 0.97,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Bebidas",
  },
  {
    ticker: "WEGE3",
    name: "WEG ON",
    price: 45.2,
    change: 1.35,
    changePercent: 3.08,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Industrial",
  },
  {
    ticker: "RENT3",
    name: "Localiza ON",
    price: 42.8,
    change: -0.65,
    changePercent: -1.5,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Aluguel de Carros",
  },
  {
    ticker: "MGLU3",
    name: "Magazine Luiza ON",
    price: 2.15,
    change: 0.08,
    changePercent: 3.86,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Varejo",
  },
  {
    ticker: "BBAS3",
    name: "Banco do Brasil ON",
    price: 28.9,
    change: 0.32,
    changePercent: 1.12,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Bancos",
  },
  {
    ticker: "SUZB3",
    name: "Suzano ON",
    price: 58.4,
    change: -0.95,
    changePercent: -1.6,
    lastUpdate: "2026-01-25T14:35:00",
    sector: "Papel e Celulose",
  },
];

export const mockUserWatchlist: Stock[] = [
  mockStocks[0], // PETR4
  mockStocks[1], // VALE3
];

export const mockAlerts: Alert[] = [
  {
    id: "1",
    ticker: "PETR4",
    stockName: "Petrobras PN",
    condition: "above",
    targetPrice: 40.0,
    currentPrice: 38.45,
    isActive: true,
    createdAt: "2026-01-20T10:00:00",
  },
  {
    id: "2",
    ticker: "PETR4",
    stockName: "Petrobras PN",
    condition: "below",
    targetPrice: 35.0,
    currentPrice: 38.45,
    isActive: true,
    createdAt: "2026-01-20T10:05:00",
  },
  {
    id: "3",
    ticker: "VALE3",
    stockName: "Vale ON",
    condition: "above",
    targetPrice: 65.0,
    currentPrice: 62.3,
    isActive: true,
    createdAt: "2026-01-21T09:30:00",
  },
  {
    id: "4",
    ticker: "VALE3",
    stockName: "Vale ON",
    condition: "below",
    targetPrice: 58.0,
    currentPrice: 62.3,
    isActive: false,
    createdAt: "2026-01-21T09:35:00",
  },
];

export const mockAlertHistory: AlertHistory[] = [
  {
    id: "h1",
    alertId: "old1",
    ticker: "PETR4",
    condition: "above",
    targetPrice: 37.5,
    triggeredPrice: 37.52,
    triggeredAt: "2026-01-24T11:23:00",
  },
  {
    id: "h2",
    alertId: "old2",
    ticker: "VALE3",
    condition: "below",
    targetPrice: 63.0,
    triggeredPrice: 62.98,
    triggeredAt: "2026-01-23T15:45:00",
  },
  {
    id: "h3",
    alertId: "old3",
    ticker: "ITUB4",
    condition: "above",
    targetPrice: 31.0,
    triggeredPrice: 31.05,
    triggeredAt: "2026-01-22T10:12:00",
  },
];

export const mockNews: NewsItem[] = [
  {
    id: "n1",
    title: "Petrobras anuncia novo plano de investimentos para 2026-2030",
    summary:
      "A estatal anunciou investimentos de US$ 102 bilhões no período, com foco em exploração do pré-sal e transição energética.",
    source: "Valor Econômico",
    url: "#",
    publishedAt: "2026-01-25T09:00:00",
    tickers: ["PETR4"],
    sentiment: "positive",
  },
  {
    id: "n2",
    title: "Vale reporta queda na produção de minério de ferro no 4T25",
    summary:
      "Produção caiu 3% em relação ao trimestre anterior devido a condições climáticas adversas em Carajás.",
    source: "InfoMoney",
    url: "#",
    publishedAt: "2026-01-25T08:30:00",
    tickers: ["VALE3"],
    sentiment: "negative",
  },
  {
    id: "n3",
    title: "Analistas elevam preço-alvo para PETR4 após resultados",
    summary:
      "Três grandes bancos revisaram estimativas após balanço do 4T25 superar expectativas do mercado.",
    source: "Bloomberg Línea",
    url: "#",
    publishedAt: "2026-01-24T18:00:00",
    tickers: ["PETR4"],
    sentiment: "positive",
  },
  {
    id: "n4",
    title: "Governo chinês anuncia novos estímulos para infraestrutura",
    summary:
      "Medidas devem beneficiar exportadoras brasileiras de commodities, especialmente Vale e siderúrgicas.",
    source: "Reuters Brasil",
    url: "#",
    publishedAt: "2026-01-24T14:20:00",
    tickers: ["VALE3"],
    sentiment: "positive",
  },
  {
    id: "n5",
    title: "Petrobras e Vale lideram volume na B3 nesta semana",
    summary:
      "As duas gigantes representaram 35% do volume total negociado na bolsa brasileira.",
    source: "Estadão",
    url: "#",
    publishedAt: "2026-01-24T12:00:00",
    tickers: ["PETR4", "VALE3"],
    sentiment: "neutral",
  },
];

export const mockDailySummary: DailySummary = {
  id: "ds1",
  date: "2026-01-25",
  generatedAt: "2026-01-25T08:00:00",
  headlines: mockNews.slice(0, 3),
  keyPoints: [
    "PETR4 em alta com novo plano de investimentos de US$ 102 bi",
    "VALE3 pressionada por queda de produção no 4T25",
    "Analistas otimistas com Petrobras após balanço",
    "China anuncia estímulos que podem beneficiar exportadoras",
  ],
  marketOverview:
    "O mercado brasileiro apresenta tendência mista hoje. O setor de petróleo segue beneficiado por resultados corporativos positivos e novos planos de investimento. Já o setor de mineração enfrenta pressão após dados de produção abaixo do esperado, apesar de notícias positivas vindas da China.",
};

export const mockUser: User = {
  id: "u1",
  name: "João Silva",
  email: "joao@exemplo.com",
  plan: "free",
  notificationsEnabled: true,
  dailySummaryTime: "08:00",
  dailySummaryEnabled: true,
  watchlistLimit: 2,
  createdAt: "2026-01-15T10:00:00",
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: 0,
    watchlistLimit: 2,
    hasAds: true,
    features: [
      "Acompanhe até 2 ativos",
      "Alertas de preço ilimitados",
      "Resumo diário com IA",
      "Notificações push",
      "Com anúncios",
    ],
  },
  {
    id: "intermediate",
    name: "Intermediário",
    price: 19.9,
    watchlistLimit: 6,
    hasAds: false,
    features: [
      "Acompanhe até 6 ativos",
      "Alertas de preço ilimitados",
      "Resumo diário com IA",
      "Notificações push",
      "Sem anúncios",
      "Suporte prioritário",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 49.9,
    watchlistLimit: 20,
    hasAds: false,
    features: [
      "Acompanhe até 20 ativos",
      "Alertas de preço ilimitados",
      "Resumo diário com IA",
      "Notificações push",
      "Sem anúncios",
      "Suporte VIP",
      "Acesso antecipado a novidades",
    ],
  },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}
