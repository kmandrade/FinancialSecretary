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
import {
  TrendingUp,
  TrendingDown,
  Bell,
  Newspaper,
  Plus,
  ArrowRight,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  mockUserWatchlist,
  mockAlerts,
  mockAlertHistory,
  mockDailySummary,
  mockUser,
  formatCurrency,
  formatPercent,
  formatDateTime,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const activeAlerts = mockAlerts.filter((a) => a.isActive);
  const recentTriggers = mockAlertHistory.slice(0, 3);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Ola, {mockUser.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seus investimentos em tempo real
          </p>
        </div>
        <Button asChild>
          <Link href="/app/ativos">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar ativo
          </Link>
        </Button>
      </div>

      {/* Notification Banner */}
      {!mockUser.notificationsEnabled && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div className="flex-1">
              <p className="font-medium text-foreground">
                Notificacoes desativadas
              </p>
              <p className="text-sm text-muted-foreground">
                Ative para receber alertas de preco e resumos diarios
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/configuracoes">Ativar</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Ativos monitorados
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {mockUserWatchlist.length}/{mockUser.watchlistLimit}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas ativos</p>
                <p className="text-2xl font-bold text-foreground">
                  {activeAlerts.length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Bell className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Alertas disparados
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {mockAlertHistory.length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <Clock className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resumos lidos</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <Newspaper className="h-5 w-5 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Watchlist */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Meus ativos</CardTitle>
              <CardDescription>Ativos que voce esta monitorando</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/ativos">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {mockUserWatchlist.length === 0 ? (
              <div className="py-8 text-center">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="mb-2 font-medium text-foreground">
                  Voce ainda nao acompanha nenhum ativo
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Adicione acoes ou FIIs para comecar a monitorar
                </p>
                <Button asChild>
                  <Link href="/app/ativos">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar ativo
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mockUserWatchlist.map((stock) => (
                  <Link
                    key={stock.ticker}
                    href={`/app/ativos/${stock.ticker}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                        {stock.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {stock.ticker}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {stock.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {formatCurrency(stock.price)}
                      </p>
                      <Badge
                        variant={stock.change >= 0 ? "default" : "destructive"}
                        className="gap-1"
                      >
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercent(stock.changePercent)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ultimos disparos</CardTitle>
              <CardDescription>
                Alertas que foram acionados recentemente
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/alertas">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTriggers.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="mb-2 font-medium text-foreground">
                  Nenhum alerta disparou ainda
                </p>
                <p className="text-sm text-muted-foreground">
                  Configure alertas para ser notificado quando os precos
                  atingirem seus alvos
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTriggers.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          trigger.condition === "above"
                            ? "bg-accent/10 text-accent"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {trigger.condition === "above" ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {trigger.ticker}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trigger.condition === "above" ? "Acima de" : "Abaixo de"}{" "}
                          {formatCurrency(trigger.targetPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {formatCurrency(trigger.triggeredPrice)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(trigger.triggeredAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resumo diario</CardTitle>
            <CardDescription>
              Gerado em {formatDateTime(mockDailySummary.generatedAt)}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/noticias">
              Ver completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-foreground">
              {mockDailySummary.marketOverview}
            </p>
          </div>

          <h4 className="mb-3 font-medium text-foreground">Pontos principais</h4>
          <ul className="space-y-2">
            {mockDailySummary.keyPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
