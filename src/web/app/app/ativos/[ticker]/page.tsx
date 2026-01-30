"use client";
import { PriceDelayBadge } from "@/components/price-delay-components";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Bell,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  EyeOff,
} from "lucide-react";
import {
  mockStocks,
  mockAlerts,
  mockNews,
  formatCurrency,
  formatPercent,
  formatDateTime,
} from "@/lib/mock-data";
import type { Alert } from "@/lib/types";
import { toast, showConfirmToast } from "@/components/ui/custom-toast";

export default function AtivoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticker = params.ticker as string;

  const stock = mockStocks.find(
    (s) => s.ticker.toLowerCase() === ticker.toLowerCase()
  );

  const [alerts, setAlerts] = useState<Alert[]>(
    mockAlerts.filter(
      (a) => a.ticker.toLowerCase() === ticker.toLowerCase()
    )
  );
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    condition: "above" as "above" | "below",
    targetPrice: "",
  });

  const stockNews = stock
    ? mockNews.filter((n) => n.tickers.includes(stock.ticker))
    : [];

  if (!stock) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-foreground">
            Ativo não encontrado
          </h2>
          <p className="mb-4 text-muted-foreground">
            O ticker {ticker} não foi encontrado na base
          </p>
          <Button asChild>
            <Link href="/app/ativos">Voltar aos ativos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddAlert = () => {
    const price = parseFloat(newAlert.targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Preco invalido", "Digite um preco valido para o alerta");
      return;
    }

    const newAlertItem: Alert = {
      id: `new-${Date.now()}`,
      ticker: stock.ticker,
      stockName: stock.name,
      condition: newAlert.condition,
      targetPrice: price,
      currentPrice: stock.price,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setAlerts([...alerts, newAlertItem]);
    setNewAlert({ condition: "above", targetPrice: "" });
    setIsAddAlertOpen(false);
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(
      alerts.map((a) =>
        a.id === alertId ? { ...a, isActive: !a.isActive } : a
      )
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
  };

  const handleDeactivateStock = () => {
    showConfirmToast({
      title: `Inativar ${stock.ticker}?`,
      description: "Tem certeza que deseja remover este ativo da sua watchlist?",
      confirmLabel: "Sim, inativar",
      cancelLabel: "Cancelar",
      onConfirm: () => {
        toast.success("Ativo removido", `${stock.ticker} foi removido da sua watchlist`);
        router.push("/app/ativos");
      },
    });
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="-ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {/* Stock Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
            {stock.ticker.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                {stock.ticker}
              </h1>
              <Badge variant="secondary">{stock.sector}</Badge>
            </div>
            <p className="text-muted-foreground">{stock.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(stock.price)}
            </p>
            <div className="mt-1 flex items-center gap-2 sm:justify-end">
              <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="gap-1">
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatCurrency(Math.abs(stock.change))} ({formatPercent(stock.changePercent)})
              </Badge>
            </div>
            <div className="mt-2">
              <PriceDelayBadge lastUpdate={stock.lastUpdate} variant="default" />
            </div>
          </div>
          {/* Botão de Inativar */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeactivateStock}
            className="text-destructive hover:bg-destructive/10"
          >
            <EyeOff className="mr-2 h-4 w-4" />
            Inativar
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alertas de preço</CardTitle>
            <CardDescription>
              Receba notificações quando o preço atingir seu alvo
            </CardDescription>
          </div>
          <Dialog open={isAddAlertOpen} onOpenChange={setIsAddAlertOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo alerta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar alerta para {stock.ticker}</DialogTitle>
                <DialogDescription>
                  {stock.name} - Preço atual: {formatCurrency(stock.price)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Condição</Label>
                  <Select
                    value={newAlert.condition}
                    onValueChange={(value: "above" | "below") =>
                      setNewAlert({ ...newAlert, condition: value })
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
                    placeholder="Ex: 40.00"
                    value={newAlert.targetPrice}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, targetPrice: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddAlertOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddAlert}>Criar alerta</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="mb-2 font-medium text-foreground">
                Nenhum alerta configurado
              </p>
              <p className="text-sm text-muted-foreground">
                Crie alertas para ser notificado quando o preço atingir seu alvo
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${alert.isActive
                      ? "border-border"
                      : "border-border/50 opacity-60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${alert.condition === "above"
                          ? "bg-accent/10 text-accent"
                          : "bg-destructive/10 text-destructive"
                        }`}
                    >
                      {alert.condition === "above" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {alert.condition === "above" ? "Acima de" : "Abaixo de"}{" "}
                        {formatCurrency(alert.targetPrice)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Criado em {formatDateTime(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* News Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notícias recentes</CardTitle>
          <CardDescription>
            Últimas notícias relacionadas a {stock.ticker}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stockNews.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma notícia encontrada para este ativo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stockNews.map((news) => (
                <div
                  key={news.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground">{news.title}</h4>
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
                  <p className="text-sm text-muted-foreground">{news.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{news.source}</span>
                      <span>-</span>
                      <span>{formatDateTime(news.publishedAt)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-primary"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Ler mais
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
