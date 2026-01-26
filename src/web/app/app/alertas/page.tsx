"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Trash2,
  Clock,
  History,
  Plus,
} from "lucide-react";
import {
  mockAlerts,
  mockAlertHistory,
  formatCurrency,
  formatDateTime,
} from "@/lib/mock-data";
import type { Alert, AlertHistory } from "@/lib/types";

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [history] = useState<AlertHistory[]>(mockAlertHistory);

  const activeAlerts = alerts.filter((a) => a.isActive);
  const inactiveAlerts = alerts.filter((a) => !a.isActive);

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

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          <p className="text-muted-foreground">
            Gerencie seus alertas de preco e veja o historico
          </p>
        </div>
        <Button asChild>
          <Link href="/app/ativos">
            <Plus className="mr-2 h-4 w-4" />
            Criar alerta
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
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
                  Alertas inativos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {inactiveAlerts.length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total disparados</p>
                <p className="text-2xl font-bold text-foreground">
                  {history.length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <History className="h-5 w-5 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Bell className="h-4 w-4" />
            Ativos ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="gap-2">
            <Clock className="h-4 w-4" />
            Inativos ({inactiveAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historico ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Nenhum alerta ativo
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Crie alertas para ser notificado quando os precos atingirem
                  seus alvos
                </p>
                <Button asChild>
                  <Link href="/app/ativos">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar primeiro alerta
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={toggleAlert}
                  onDelete={deleteAlert}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactiveAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Nenhum alerta inativo
                </h3>
                <p className="text-muted-foreground">
                  Alertas desativados aparecerao aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {inactiveAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={toggleAlert}
                  onDelete={deleteAlert}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {history.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <History className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Nenhum alerta disparou ainda
                </h3>
                <p className="text-muted-foreground">
                  Quando seus alertas forem acionados, o historico aparecera
                  aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {history.map((trigger) => (
                <Card key={trigger.id}>
                  <CardContent className="flex items-center justify-between py-4">
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
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/app/ativos/${trigger.ticker}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {trigger.ticker}
                          </Link>
                          <Badge variant="secondary" className="text-xs">
                            {trigger.condition === "above"
                              ? "Acima de"
                              : "Abaixo de"}{" "}
                            {formatCurrency(trigger.targetPrice)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Disparado em {formatDateTime(trigger.triggeredAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {formatCurrency(trigger.triggeredPrice)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Preco no disparo
                      </p>
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

function AlertCard({
  alert,
  onToggle,
  onDelete,
}: {
  alert: Alert;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className={alert.isActive ? "" : "opacity-60"}>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              alert.condition === "above"
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
            <div className="flex items-center gap-2">
              <Link
                href={`/app/ativos/${alert.ticker}`}
                className="font-medium text-foreground hover:underline"
              >
                {alert.ticker}
              </Link>
              <Badge variant="secondary" className="text-xs">
                {alert.condition === "above" ? "Acima de" : "Abaixo de"}{" "}
                {formatCurrency(alert.targetPrice)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {alert.stockName} - Criado em {formatDateTime(alert.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              Atual: {formatCurrency(alert.currentPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              Alvo: {formatCurrency(alert.targetPrice)}
            </p>
          </div>
          <Switch
            checked={alert.isActive}
            onCheckedChange={() => onToggle(alert.id)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(alert.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
