"use client";

import { useState, useEffect } from "react";
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
  History,
  X,
  Play,
} from "lucide-react";
import {
  mockUserWatchlist,
  mockAlertHistory,
  mockDailySummary,
  mockUser,
  formatCurrency,
  formatPercent,
  formatDateTime
} from "@/lib/mock-data";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { NotificationBanner } from "@/components/notification-banner";
import { PriceDelayBadge } from "@/components/price-delay-components";
import { CryptoSection } from "@/components/crypto-section";

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorialBanner, setShowTutorialBanner] = useState(true);

  useEffect(() => {
    // Verificar se usuario ja viu o tutorial
    const tutorialDismissed = localStorage.getItem("tutorial_banner_dismissed") === "true";
    setShowTutorialBanner(!tutorialDismissed);
  }, []);

  const handleDismissTutorial = () => {
    localStorage.setItem("tutorial_banner_dismissed", "true");
    setShowTutorialBanner(false);
  };

  const handleStartTutorial = () => {
    // Resetar flag do onboarding para forçar exibição
    localStorage.removeItem("onboarding_completed");
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
  };

  const recentTriggers = mockAlertHistory.slice(0, 3);

  return (
    <>
      {/* Wizard de Onboarding */}
      <OnboardingWizard
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      <div className="space-y-6 pb-20 lg:pb-0">
        {/* Banner de Notificações */}
        <NotificationBanner />

        {/* Banner de Tutorial - Versão Compacta */}
        {showTutorialBanner && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Primeiro acesso? Veja nosso tutorial rápido de 3 minutos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleStartTutorial} size="sm" variant="default">
                    Iniciar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismissTutorial}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Header - SEM botão de logout */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Olá, {mockUser.name.split(" ")[0]}!
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

        {/* Secao de Criptomoedas */}
        <CryptoSection />

        {/* Stats Grid - Mais compacto */}
        <div className="grid gap-4 sm:grid-cols-3">
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
                  <p className="text-sm text-muted-foreground">
                    Alertas disparados
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockAlertHistory.length}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                  <History className="h-5 w-5 text-chart-1" />
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

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Watchlist */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Meus ativos</CardTitle>
                <CardDescription>Ativos monitorados</CardDescription>
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
                    Nenhum ativo monitorado
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Adicione ações ou FIIs para começar
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
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                          {stock.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {stock.ticker}
                          </p>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {formatCurrency(stock.price)}
                        </p>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant={stock.change >= 0 ? "default" : "destructive"}
                            className="gap-1 text-xs"
                          >
                            {stock.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {formatPercent(stock.changePercent)}
                          </Badge>
                          <PriceDelayBadge
                            lastUpdate={stock.lastUpdate}
                            variant="compact"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Últimos disparos</CardTitle>
                <CardDescription>Alertas acionados</CardDescription>
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
                    Configure alertas para ser notificado
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTriggers.map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
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
                          <p className="text-xs text-muted-foreground sm:text-sm">
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
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Resumo diário</CardTitle>
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
            <div className="mb-4 rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-foreground">
                {mockDailySummary.marketOverview}
              </p>
            </div>

            <h4 className="mb-3 font-medium text-foreground">Pontos principais</h4>
            <ul className="space-y-2">
              {mockDailySummary.keyPoints.slice(0, 3).map((point, index) => (
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
    </>
  );
}
