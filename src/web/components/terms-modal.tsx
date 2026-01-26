"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Clock, Shield, Info } from "lucide-react";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  acceptedTerms: boolean;
  onTermsChange: (checked: boolean) => void;
  acceptedDisclaimer: boolean;
  onDisclaimerChange: (checked: boolean) => void;
}

export function TermsModal({
  open,
  onOpenChange,
  onAccept,
  acceptedTerms,
  onTermsChange,
  acceptedDisclaimer,
  onDisclaimerChange,
}: TermsModalProps) {
  const canProceed = acceptedTerms && acceptedDisclaimer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Termos de Uso e Avisos Importantes</DialogTitle>
          <DialogDescription>
            Leia atentamente antes de prosseguir
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-4">
            {/* Aviso Principal */}
            <div className="rounded-lg border-2 border-warning bg-warning/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-warning" />
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">
                    ⚠️ AVISO LEGAL IMPORTANTE
                  </h3>
                  <p className="text-sm font-medium text-foreground">
                    Este serviço é APENAS INFORMATIVO e NÃO constitui recomendação
                    de investimento.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    O InvestAlerta não oferece consultoria financeira. Todas as
                    decisões de investimento são de sua exclusiva
                    responsabilidade. Consulte sempre um profissional certificado
                    (CPA, CFP, analista CNPI) antes de investir.
                  </p>
                </div>
              </div>
            </div>

            {/* Delay de Preços */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Delay nas Cotações
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    As cotações de preços podem apresentar um{" "}
                    <strong className="text-foreground">
                      atraso de 5 a 15 minutos
                    </strong>{" "}
                    (ou mais em casos excepcionais) em relação ao mercado em tempo
                    real.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Este delay é <strong>legal e autorizado</strong>. Dados em
                    tempo real da B3 exigem licenças profissionais com custos
                    elevados. Nosso serviço utiliza APIs de cotação com delay para
                    manter o acesso gratuito.
                  </p>
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Como Funcionam os Alertas
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Os alertas de preço são verificados periodicamente (a cada 1-15
                    minutos). Você receberá notificações quando o preço atingir seu
                    alvo, respeitando o delay das cotações.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Sistema anti-spam:</strong> Para evitar notificações
                    repetidas, um alerta só será disparado novamente após um
                    intervalo mínimo de tempo.
                  </p>
                </div>
              </div>
            </div>

            {/* Resumo IA */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Resumo de Notícias com IA
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    O resumo diário é gerado por inteligência artificial e pode
                    conter imprecisões. Sempre verifique as fontes originais antes
                    de tomar qualquer decisão.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Fontes citadas:</strong> Todo resumo inclui links para
                    as notícias originais para que você possa validar as
                    informações.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacidade */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Privacidade e Dados
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Seus dados pessoais e preferências de investimento são
                    armazenados de forma segura e não serão compartilhados com
                    terceiros sem seu consentimento.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Você pode solicitar a exclusão de sua conta e todos os dados a
                    qualquer momento nas configurações.
                  </p>
                </div>
              </div>
            </div>

            {/* Limites dos Planos */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Limites dos Planos</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • <strong>Plano Free:</strong> até 2 ativos, com anúncios
                </li>
                <li>
                  • <strong>Plano Intermediário:</strong> até 6 ativos, sem
                  anúncios
                </li>
                <li>
                  • <strong>Plano Gold:</strong> até 20 ativos, sem anúncios
                </li>
              </ul>
            </div>

            {/* Isenção de Responsabilidade */}
            <div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <h4 className="font-semibold text-foreground">
                Isenção de Responsabilidade
              </h4>
              <p className="text-sm text-muted-foreground">
                O InvestAlerta não se responsabiliza por perdas financeiras,
                decisões de investimento ou quaisquer danos decorrentes do uso
                deste serviço. Investimentos envolvem riscos e você pode perder
                parte ou todo o capital investido.
              </p>
              <p className="text-sm text-muted-foreground">
                O mercado financeiro é volátil e imprevisível. Rentabilidade
                passada não é garantia de rentabilidade futura.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="space-y-4 border-t pt-4">
          {/* Checkbox de Termos */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={onTermsChange}
            />
            <label
              htmlFor="terms"
              className="flex-1 cursor-pointer text-sm leading-tight text-muted-foreground"
            >
              Li e aceito os{" "}
              <Link
                href="/termos"
                target="_blank"
                className="font-medium text-primary hover:underline"
              >
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link
                href="/privacidade"
                target="_blank"
                className="font-medium text-primary hover:underline"
              >
                Política de Privacidade
              </Link>
            </label>
          </div>

          {/* Checkbox de Disclaimer */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="disclaimer"
              checked={acceptedDisclaimer}
              onCheckedChange={onDisclaimerChange}
            />
            <label
              htmlFor="disclaimer"
              className="flex-1 cursor-pointer text-sm leading-tight text-muted-foreground"
            >
              <strong className="text-foreground">
                Declaro que estou ciente de que:
              </strong>{" "}
              (1) este serviço é apenas informativo e não constitui recomendação de
              investimento, (2) as cotações podem ter atraso de 5-15 minutos, (3)
              devo consultar um profissional certificado antes de investir, e (4) o
              InvestAlerta não se responsabiliza por minhas decisões de
              investimento
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAccept} disabled={!canProceed}>
            Aceitar e Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Versão compacta para usar em outras partes do app
export function DisclaimerBanner() {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Aviso importante</p>
          <p className="mt-1 text-muted-foreground">
            Este serviço é apenas informativo e não constitui recomendação de
            investimento. As cotações podem apresentar atraso de 5 a 15 minutos em
            relação ao mercado. Consulte sempre um profissional certificado antes
            de tomar decisões de investimento.
          </p>
        </div>
      </div>
    </div>
  );
}
