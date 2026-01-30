"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  TrendingUp,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { mockStocks, formatCurrency, formatPercent } from "@/lib/mock-data";
import type { Stock } from "@/lib/types";
import { toast, showConfirmToast } from "@/components/ui/custom-toast";

interface OnboardingWizardProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    ticker: "",
    condition: "above" as "above" | "below",
    targetPrice: "",
  });
  const [pushEnabled, setPushEnabled] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const availableStocks = mockStocks.filter(
    (stock) =>
      !selectedStocks.some((s) => s.ticker === stock.ticker) &&
      (stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddStock = (stock: Stock) => {
    if (selectedStocks.length < 2) {
      setSelectedStocks([...selectedStocks, stock]);
      setSearchQuery("");
    }
  };

  const handleRemoveStock = (ticker: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s.ticker !== ticker));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedStocks.length === 0) {
      toast.warning("Selecione um ativo", "Adicione pelo menos 1 ativo para continuar");
      return;
    }
    if (currentStep === 2) {
      const price = parseFloat(alertConfig.targetPrice);
      if (!alertConfig.ticker || isNaN(price) || price <= 0) {
        toast.warning("Alerta incompleto", "Configure um alerta valido para continuar");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleEnableNotifications = async () => {
    // Simular pedido de permissão de notificação
    try {
      // Em produção: await Notification.requestPermission()
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPushEnabled(true);
      
      // Simular sucesso
      setTimeout(() => {
        toast.success("Notificacoes ativadas", "Voce recebera alertas em tempo real");
      }, 300);
    } catch {
      toast.error("Erro ao ativar", "Nao foi possivel ativar as notificacoes. Tente novamente.");
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleSkipOnboarding = () => {
    showConfirmToast({
      title: "Pular tutorial?",
      description: "Voce pode configurar tudo depois nas configuracoes.",
      confirmLabel: "Sim, pular",
      cancelLabel: "Continuar tutorial",
      onConfirm: () => onComplete(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Bem-vindo ao InvestAlerta!
              </DialogTitle>
              <DialogDescription>
                Configure sua conta em 3 passos simples
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipOnboarding}
              className="text-muted-foreground"
            >
              Pular tutorial
            </Button>
          </div>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Passo {currentStep} de {totalSteps}
            </span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Escolher Ativos */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Escolha seus ativos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione de 1 a 2 ações ou FIIs que você deseja acompanhar
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ticker ou nome (ex: PETR4, Vale)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedStocks.length}/2 ativos selecionados
              </p>
            </div>

            {/* Selected Stocks */}
            {selectedStocks.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Ativos selecionados:
                </p>
                {selectedStocks.map((stock) => (
                  <div
                    key={stock.ticker}
                    className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStock(stock.ticker)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Available Stocks */}
            {searchQuery.length > 0 && (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-2">
                {availableStocks.length > 0 ? (
                  availableStocks.slice(0, 5).map((stock) => (
                    <button
                      key={stock.ticker}
                      onClick={() => handleAddStock(stock)}
                      disabled={selectedStocks.length >= 2}
                      className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="text-xs"
                        >
                          {formatPercent(stock.changePercent)}
                        </Badge>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    Nenhum ativo encontrado
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={handleNextStep}
                disabled={selectedStocks.length === 0}
              >
                Próximo passo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Criar Alerta */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Crie seu primeiro alerta
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure quando deseja ser notificado sobre mudanças de preço
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Escolha o ativo
                  </label>
                  <Select
                    value={alertConfig.ticker}
                    onValueChange={(value) =>
                      setAlertConfig({ ...alertConfig, ticker: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um ativo" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedStocks.map((stock) => (
                        <SelectItem key={stock.ticker} value={stock.ticker}>
                          {stock.ticker} - {stock.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Condição
                  </label>
                  <Select
                    value={alertConfig.condition}
                    onValueChange={(value: "above" | "below") =>
                      setAlertConfig({ ...alertConfig, condition: value })
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
                  <label className="text-sm font-medium text-foreground">
                    Preço alvo (R$)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 40.00"
                    value={alertConfig.targetPrice}
                    onChange={(e) =>
                      setAlertConfig({
                        ...alertConfig,
                        targetPrice: e.target.value,
                      })
                    }
                  />
                  {alertConfig.ticker && (
                    <p className="text-xs text-muted-foreground">
                      Preço atual:{" "}
                      {formatCurrency(
                        selectedStocks.find((s) => s.ticker === alertConfig.ticker)
                          ?.price || 0
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Dica:</strong> Você receberá uma notificação quando o
                preço de {alertConfig.ticker || "seu ativo"} atingir o valor
                definido. O delay pode ser de 5 a 15 minutos.
              </p>
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Voltar
              </Button>
              <Button onClick={handleNextStep}>
                Próximo passo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Habilitar Notificações */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Ative as notificações
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas em tempo real quando os preços mudarem
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                  {pushEnabled ? (
                    <CheckCircle2 className="h-10 w-10 text-accent" />
                  ) : (
                    <Bell className="h-10 w-10 text-accent" />
                  )}
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  {pushEnabled
                    ? "Notificações ativadas!"
                    : "Ative as notificações push"}
                </h4>
                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  {pushEnabled
                    ? "Você receberá alertas em tempo real quando seus preços alvo forem atingidos."
                    : "Para receber alertas instantâneos, precisamos da sua permissão para enviar notificações."}
                </p>
                {!pushEnabled && (
                  <Button onClick={handleEnableNotifications} size="lg">
                    <Bell className="mr-2 h-4 w-4" />
                    Ativar notificações
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Alertas configurados
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedStocks.length} ativo(s) e 1 alerta criado
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Resumo diário ativo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Você receberá um resumo com IA às 08:00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Pronto para usar!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Você pode adicionar mais ativos e alertas a qualquer momento
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Voltar
              </Button>
              <Button onClick={handleComplete} size="lg">
                Concluir e ir para o Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
