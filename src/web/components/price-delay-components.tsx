import { Clock, Info, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateTime } from "@/lib/mock-data";

interface PriceDelayBadgeProps {
  lastUpdate: string;
  variant?: "default" | "compact" | "full";
}

export function PriceDelayBadge({
  lastUpdate,
  variant = "default",
}: PriceDelayBadgeProps) {
  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              Delay ~15min
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              Última atualização: {formatDateTime(lastUpdate)}
            </p>
            <p className="text-xs text-muted-foreground">
              Os preços podem ter um atraso de 5 a 15 minutos
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "full") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            Última atualização: {formatDateTime(lastUpdate)}
          </p>
          <p className="text-xs text-muted-foreground">
            Delay estimado: até 15 minutos
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Os preços são atualizados periodicamente e podem apresentar um
                atraso de 5 a 15 minutos em relação ao mercado em tempo real.
                Isso é normal para serviços de cotação não profissionais.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>Atualizado: {formatDateTime(lastUpdate)}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1 cursor-help">
              <Info className="h-3 w-3" />
              Delay ~15min
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              Os preços podem ter um atraso de 5 a 15 minutos em relação ao
              mercado em tempo real. Isso é normal e transparente.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function GlobalDelayNotice() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>Última atualização: 14:35</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <span>(delay ~15 min)</span>
              <Info className="h-3 w-3" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p className="mb-2 font-semibold">Sobre o delay de preços</p>
            <p className="text-xs">
              As cotações são atualizadas a cada 5-15 minutos. Este atraso é
              normal para serviços informativos e não afeta a funcionalidade dos
              alertas.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Em caso de mercado muito volátil, o delay pode ser maior.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function DelayWarningBanner({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
          <Clock className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">
            Transparência sobre os preços
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Os preços exibidos podem ter um{" "}
            <strong>atraso de 5 a 15 minutos</strong> em relação ao mercado em
            tempo real.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Por que existe o delay?</strong> Dados em tempo real da B3
            exigem licenças profissionais caras. Usamos APIs com delay legal.
          </p>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="mt-3 text-sm font-medium text-accent hover:underline"
            >
              Entendi, não mostrar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DelayInfoCard() {
  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-foreground">Sobre as cotações</h4>
      </div>

      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Delay de 5-15 minutos</p>
            <p>
              Os preços são atualizados periodicamente e podem apresentar um
              atraso em relação ao mercado em tempo real.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Por que existe o delay?</p>
            <p>
              Dados em tempo real exigem licenças profissionais da B3. Usamos
              APIs autorizadas com delay legal para manter o serviço acessível.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Os alertas funcionam?</p>
            <p>
              Sim! Os alertas são verificados regularmente e você será notificado
              quando o preço atingir seu alvo, respeitando o delay informado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
