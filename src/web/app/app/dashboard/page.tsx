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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Bell,
  Newspaper,
  Plus,
  ArrowRight,
  History,
  Bitcoin,
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
  formatDateTime,
} from "@/lib/mock-data";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { NotificationBanner } from "@/components/notification-banner";
import { PriceDelayBadge } from "@/components/price-delay-components";
import { toast } from "@/components/ui/custom-toast";

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTutorialBanner, setShowTutorialBanner] = useState(true);
  const [bitcoinEnabled, setBitcoinEnabled] = useState(false);
  const [showBitcoinDialog, setShowBitcoinDialog] = useState(false);
  const [bitcoinAlert, setBitcoinAlert] = useState({
    condition: "above" as "above" | "below",
    targetPrice: "",
  });

  // Dados mockados do Bitcoin
  const bitcoinData = {
    ticker: "BTC",
    name: "Bitcoin",
    price: 245678.50,
    change: 3456.20,
    changePercent: 1.42,
    lastUpdate: new Date().toISOString(),
  };

  useEffect(() => {
    // Verificar se usuário já viu o tutorial
    const tutorialDismissed = localStorage.getItem("tutorial_banner_dismissed") === "true";
    setShowTutorialBanner(!tutorialDismissed);

    // Verificar se Bitcoin está ativo
    const btcActive = localStorage.getItem("bitcoin_alert_active") === "true";
    setBitcoinEnabled(btcActive);

    // Carregar configuração do Bitcoin se existir
    const btcConfig = localStorage.getItem("bitcoin_alert_config");
    if (btcConfig) {
      setBitcoinAlert(JSON.parse(btcConfig));
    }
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

  const handleBitcoinClick = () => {
    setShowBitcoinDialog(true);
  };

  const handleBitcoinAlertSave = () => {
    const price = parseFloat(bitcoinAlert.targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Preco invalido", "Digite um preco valido para o alerta");
      return;
    }

    // Salvar configuração
    localStorage.setItem("bitcoin_alert_active", "true");
    localStorage.setItem("bitcoin_alert_config", JSON.stringify(bitcoinAlert));
    setBitcoinEnabled(true);
    setShowBitcoinDialog(false);

    toast.priceUp(
      "Alerta de Bitcoin configurado!",
      `Voce sera notificado quando o preco estiver ${bitcoinAlert.condition === "above" ? "acima" : "abaixo"} de ${formatCurrency(price)}`
    );
  };

  const handleBitcoinDisable = () => {
    localStorage.setItem("bitcoin_alert_active", "false");
    setBitcoinEnabled(false);
    setShowBitcoinDialog(false);
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

        {/* Bitcoin Alert - Versão Compacta/Expandida */}
        {!bitcoinEnabled ? (
          // Bitcoin INATIVO - Versão Minimalista
          <button
            onClick={handleBitcoinClick}
            className="w-full flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50 hover:border-primary/30"
          >
            <Bitcoin className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Ativar monitoramento de Bitcoin
            </span>
            <Plus className="ml-auto h-4 w-4 text-muted-foreground" />
          </button>
        ) : (
          // Bitcoin ATIVO - Versão Expandida
          <Card 
            className="cursor-pointer border-yellow-500/50 bg-yellow-500/5 transition-all hover:shadow-md"
            onClick={handleBitcoinClick}
          >
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                <Bitcoin className="h-7 w-7 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">Bitcoin (BTC)</p>
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                    Ativo
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alerta configurado - Clique para editar
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(bitcoinData.price)}
                </p>
                <Badge
                  variant={bitcoinData.change >= 0 ? "default" : "destructive"}
                  className="gap-1"
                >
                  {bitcoinData.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercent(bitcoinData.changePercent)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

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

      {/* Bitcoin Alert Dialog */}
      <Dialog open={showBitcoinDialog} onOpenChange={setShowBitcoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-yellow-500" />
              Alerta de Bitcoin
            </DialogTitle>
            <DialogDescription>
              Preço atual: {formatCurrency(bitcoinData.price)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Condição</Label>
              <Select
                value={bitcoinAlert.condition}
                onValueChange={(value: "above" | "below") =>
                  setBitcoinAlert({ ...bitcoinAlert, condition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">
                    Acima de (preço maior ou igual)
                  </SelectItem>
                  <SelectItem value="below">
                    Abaixo de (preço menor ou igual)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preço alvo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Ex: 250000.00"
                value={bitcoinAlert.targetPrice}
                onChange={(e) =>
                  setBitcoinAlert({
                    ...bitcoinAlert,
                    targetPrice: e.target.value,
                  })
                }
              />
            </div>

            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">💡 Dica:</strong> Você será
                notificado quando o Bitcoin atingir o valor definido. O delay pode
                ser de 5 a 15 minutos.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {bitcoinEnabled && (
              <Button
                variant="outline"
                onClick={handleBitcoinDisable}
                className="w-full sm:w-auto"
              >
                Desativar alerta
              </Button>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowBitcoinDialog(false)}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleBitcoinAlertSave}
                className="flex-1 sm:flex-none"
              >
                {bitcoinEnabled ? "Atualizar" : "Ativar alerta"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
