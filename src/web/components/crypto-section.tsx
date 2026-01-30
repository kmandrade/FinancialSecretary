"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Bell,
  BellOff,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/mock-data";
import { toast } from "@/components/ui/custom-toast";

// Icones personalizados para cada criptomoeda
const BitcoinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c1.77-.45 2.34-1.94 2.34-2.96 0-1.28-.54-2.21-1.64-2.74-.46-.22-1.01-.36-1.65-.42V3.5h-1.5V5h-1V3.5h-1.5V5H6v1.5h1.5v11H6v1.5h1.36v1.5h1.5V19h1v1.5h1.5V19h.41c.86 0 1.59-.12 2.21-.37 1.31-.54 2.02-1.63 2.02-3.12 0-1.27-.57-2.24-1.69-2.87zM9 7h2.12c.74 0 1.31.13 1.7.4.39.26.58.67.58 1.22 0 .55-.2.96-.59 1.24-.39.28-.95.42-1.69.42H9V7zm4.12 8.88c-.43.33-1.07.49-1.92.49H9v-3.5h2.2c.86 0 1.5.16 1.92.49.42.33.63.79.63 1.39 0 .58-.21 1.01-.63 1.13z"/>
  </svg>
);

const EthereumIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 1.5L5.5 12.25 12 16 18.5 12.25 12 1.5zM5.5 13.5L12 22.5l6.5-9L12 17.25 5.5 13.5z"/>
  </svg>
);

const SolanaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 16.5l3-3h12l-3 3h-12zm0-4.5l3-3h12l-3 3h-12zm15-4.5l-3 3h-12l3-3h12z"/>
  </svg>
);

// Dados mockados das criptomoedas
const cryptoData = {
  BTC: {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    price: 245678.50,
    change: 3456.20,
    changePercent: 1.42,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    Icon: BitcoinIcon,
  },
  ETH: {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    price: 12450.80,
    change: -156.30,
    changePercent: -1.24,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    Icon: EthereumIcon,
  },
  SOL: {
    id: "SOL",
    name: "Solana",
    symbol: "SOL",
    price: 892.45,
    change: 45.67,
    changePercent: 5.39,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    Icon: SolanaIcon,
  },
};

type CryptoId = keyof typeof cryptoData;

interface CryptoAlert {
  condition: "above" | "below";
  targetPrice: string;
  enabled: boolean;
}

export function CryptoSection() {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoId | null>(null);
  const [alerts, setAlerts] = useState<Record<CryptoId, CryptoAlert>>({
    BTC: { condition: "above", targetPrice: "", enabled: false },
    ETH: { condition: "above", targetPrice: "", enabled: false },
    SOL: { condition: "above", targetPrice: "", enabled: false },
  });

  // Carregar alertas salvos
  useEffect(() => {
    const savedAlerts = localStorage.getItem("crypto_alerts");
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const hasActiveAlerts = Object.values(alerts).some(a => a.enabled);

  const handleOpenDialog = (cryptoId?: CryptoId) => {
    if (cryptoId) {
      setSelectedCrypto(cryptoId);
    } else {
      setSelectedCrypto("BTC");
    }
    setShowDialog(true);
  };

  const handleSaveAlert = () => {
    if (!selectedCrypto) return;

    const price = parseFloat(alerts[selectedCrypto].targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Preco invalido", "Digite um preco valido para o alerta");
      return;
    }

    const newAlerts = {
      ...alerts,
      [selectedCrypto]: {
        ...alerts[selectedCrypto],
        enabled: true,
      },
    };

    setAlerts(newAlerts);
    localStorage.setItem("crypto_alerts", JSON.stringify(newAlerts));

    const crypto = cryptoData[selectedCrypto];
    toast.priceUp(
      `Alerta de ${crypto.name} configurado!`,
      `Voce sera notificado quando o preco estiver ${alerts[selectedCrypto].condition === "above" ? "acima" : "abaixo"} de ${formatCurrency(price)}`
    );

    setShowDialog(false);
  };

  const handleDisableAlert = (cryptoId: CryptoId) => {
    const newAlerts = {
      ...alerts,
      [cryptoId]: {
        ...alerts[cryptoId],
        enabled: false,
      },
    };

    setAlerts(newAlerts);
    localStorage.setItem("crypto_alerts", JSON.stringify(newAlerts));

    toast.info("Alerta desativado", `Monitoramento de ${cryptoData[cryptoId].name} desativado`);
  };

  const updateAlert = (cryptoId: CryptoId, field: keyof CryptoAlert, value: string | boolean) => {
    setAlerts(prev => ({
      ...prev,
      [cryptoId]: {
        ...prev[cryptoId],
        [field]: value,
      },
    }));
  };

  // Versao compacta - sem alertas ativos
  if (!hasActiveAlerts) {
    return (
      <>
        <button
          onClick={() => handleOpenDialog()}
          className="w-full flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50 hover:border-primary/30"
        >
          <div className="flex -space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20 border-2 border-background">
              <BitcoinIcon className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 border-2 border-background">
              <EthereumIcon className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 border-2 border-background">
              <SolanaIcon className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            Ativar monitoramento de criptomoedas
          </span>
          <Plus className="ml-auto h-4 w-4 text-muted-foreground" />
        </button>

        <CryptoDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          selectedCrypto={selectedCrypto}
          setSelectedCrypto={setSelectedCrypto}
          alerts={alerts}
          updateAlert={updateAlert}
          onSave={handleSaveAlert}
          onDisable={handleDisableAlert}
        />
      </>
    );
  }

  // Versao expandida - com alertas ativos
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3">
        {(Object.keys(cryptoData) as CryptoId[]).map((cryptoId) => {
          const crypto = cryptoData[cryptoId];
          const alert = alerts[cryptoId];
          const Icon = crypto.Icon;

          return (
            <button
              key={cryptoId}
              onClick={() => handleOpenDialog(cryptoId)}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm ${
                alert.enabled
                  ? `${crypto.borderColor} ${crypto.bgColor}`
                  : "border-border bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${crypto.bgColor}`}>
                <Icon className={`h-5 w-5 ${crypto.color}`} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm text-foreground truncate">
                    {crypto.symbol}
                  </span>
                  {alert.enabled && (
                    <Bell className="h-3 w-3 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {formatCurrency(crypto.price)}
                </p>
              </div>
              <Badge
                variant={crypto.change >= 0 ? "default" : "destructive"}
                className="gap-0.5 text-xs shrink-0"
              >
                {crypto.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercent(crypto.changePercent)}
              </Badge>
            </button>
          );
        })}
      </div>

      <CryptoDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        selectedCrypto={selectedCrypto}
        setSelectedCrypto={setSelectedCrypto}
        alerts={alerts}
        updateAlert={updateAlert}
        onSave={handleSaveAlert}
        onDisable={handleDisableAlert}
      />
    </>
  );
}

// Componente do Dialog separado
interface CryptoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCrypto: CryptoId | null;
  setSelectedCrypto: (crypto: CryptoId) => void;
  alerts: Record<CryptoId, CryptoAlert>;
  updateAlert: (cryptoId: CryptoId, field: keyof CryptoAlert, value: string | boolean) => void;
  onSave: () => void;
  onDisable: (cryptoId: CryptoId) => void;
}

function CryptoDialog({
  open,
  onOpenChange,
  selectedCrypto,
  setSelectedCrypto,
  alerts,
  updateAlert,
  onSave,
  onDisable,
}: CryptoDialogProps) {
  if (!selectedCrypto) return null;

  const crypto = cryptoData[selectedCrypto];
  const alert = alerts[selectedCrypto];
  const Icon = crypto.Icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${crypto.bgColor}`}>
              <Icon className={`h-5 w-5 ${crypto.color}`} />
            </div>
            Alertas de Criptomoedas
          </DialogTitle>
          <DialogDescription>
            Configure alertas de preco para suas criptomoedas favoritas
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCrypto} onValueChange={(v) => setSelectedCrypto(v as CryptoId)}>
          <TabsList className="grid w-full grid-cols-3">
            {(Object.keys(cryptoData) as CryptoId[]).map((cryptoId) => {
              const c = cryptoData[cryptoId];
              const CIcon = c.Icon;
              return (
                <TabsTrigger key={cryptoId} value={cryptoId} className="gap-1.5">
                  <CIcon className={`h-4 w-4 ${c.color}`} />
                  <span className="hidden sm:inline">{c.symbol}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(Object.keys(cryptoData) as CryptoId[]).map((cryptoId) => {
            const c = cryptoData[cryptoId];
            const a = alerts[cryptoId];

            return (
              <TabsContent key={cryptoId} value={cryptoId} className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-sm text-muted-foreground">Preco atual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(c.price)}
                    </p>
                    <Badge
                      variant={c.change >= 0 ? "default" : "destructive"}
                      className="gap-1"
                    >
                      {c.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {formatPercent(c.changePercent)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Condicao</Label>
                    <Select
                      value={a.condition}
                      onValueChange={(value: "above" | "below") =>
                        updateAlert(cryptoId, "condition", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Acima de (preco maior ou igual)</SelectItem>
                        <SelectItem value="below">Abaixo de (preco menor ou igual)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preco alvo (R$)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 250000"
                      value={a.targetPrice}
                      onChange={(e) => updateAlert(cryptoId, "targetPrice", e.target.value)}
                    />
                  </div>
                </div>

                {a.enabled && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-medium">Alerta ativo</span>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {alert.enabled && (
            <Button
              variant="outline"
              onClick={() => {
                onDisable(selectedCrypto);
                onOpenChange(false);
              }}
              className="w-full sm:w-auto"
            >
              <BellOff className="mr-2 h-4 w-4" />
              Desativar
            </Button>
          )}
          <Button onClick={onSave} className="w-full sm:w-auto">
            <Bell className="mr-2 h-4 w-4" />
            {alert.enabled ? "Atualizar alerta" : "Ativar alerta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
