import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Newspaper,
  Sparkles,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  mockNews,
  mockDailySummary,
  mockUser,
  formatDateTime,
} from "@/lib/mock-data";

export default function NoticiasPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Noticias e resumo</h1>
        <p className="text-muted-foreground">
          Acompanhe as noticias dos seus ativos e receba resumos diarios
        </p>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Resumo IA
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            Todas as noticias
          </TabsTrigger>
        </TabsList>

        {/* Daily Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Resumo diario</CardTitle>
                  <CardDescription>
                    Gerado por IA em {formatDateTime(mockDailySummary.generatedAt)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Market Overview */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">
                  Visao geral do mercado
                </h3>
                <p className="rounded-lg bg-background p-4 text-sm leading-relaxed text-foreground">
                  {mockDailySummary.marketOverview}
                </p>
              </div>

              {/* Key Points */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">
                  Pontos principais
                </h3>
                <ul className="space-y-2">
                  {mockDailySummary.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-background p-3"
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Headlines */}
              <div>
                <h3 className="mb-3 font-semibold text-foreground">
                  Principais manchetes
                </h3>
                <div className="space-y-3">
                  {mockDailySummary.headlines.map((news) => (
                    <div
                      key={news.id}
                      className="flex flex-col gap-2 rounded-lg bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-foreground">
                          {news.title}
                        </h4>
                        <Badge
                          variant={
                            news.sentiment === "positive"
                              ? "default"
                              : news.sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                          className="shrink-0"
                        >
                          {news.sentiment === "positive"
                            ? "Positivo"
                            : news.sentiment === "negative"
                              ? "Negativo"
                              : "Neutro"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {news.summary}
                      </p>
                      <div className="flex items-center gap-2">
                        {news.tickers.map((ticker) => (
                          <Link
                            key={ticker}
                            href={`/app/ativos/${ticker}`}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            {ticker}
                          </Link>
                        ))}
                        <span className="text-xs text-muted-foreground">-</span>
                        <span className="text-xs text-muted-foreground">
                          {news.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuracoes do resumo</CardTitle>
              <CardDescription>
                Configure quando deseja receber seu resumo diario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Horario do resumo diario
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Atualmente configurado para {mockUser.dailySummaryTime}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/configuracoes">Alterar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All News Tab */}
        <TabsContent value="news" className="space-y-4">
          {mockNews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Newspaper className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Nenhuma noticia encontrada
                </h3>
                <p className="text-muted-foreground">
                  Adicione ativos a sua watchlist para ver noticias relacionadas
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockNews.map((news) => (
                <Card key={news.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-foreground">
                            {news.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {news.summary}
                          </p>
                        </div>
                        <Badge
                          variant={
                            news.sentiment === "positive"
                              ? "default"
                              : news.sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                          className="shrink-0 gap-1"
                        >
                          {news.sentiment === "positive" ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : news.sentiment === "negative" ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : null}
                          {news.sentiment === "positive"
                            ? "Positivo"
                            : news.sentiment === "negative"
                              ? "Negativo"
                              : "Neutro"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {news.tickers.map((ticker) => (
                            <Link
                              key={ticker}
                              href={`/app/ativos/${ticker}`}
                              className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                            >
                              {ticker}
                            </Link>
                          ))}
                          <span className="text-xs text-muted-foreground">
                            {news.source} - {formatDateTime(news.publishedAt)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-primary hover:bg-transparent"
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Ler mais
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
