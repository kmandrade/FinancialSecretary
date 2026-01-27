"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Bell,
  BellOff,
  ExternalLink,
  X,
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NotificationStatus = "default" | "denied" | "granted" | "blocked";

const DISMISS_UNTIL_KEY = "investalerta_notif_banner_dismiss_until_v1";
const DISMISS_DAYS_DEFAULT = 7;

export function NotificationBanner() {
  const [notificationStatus, setNotificationStatus] =
    useState<NotificationStatus>("default");
  const [showDialog, setShowDialog] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const until = Number(localStorage.getItem(DISMISS_UNTIL_KEY) || "0");
    if (until && Date.now() < until) {
      setDismissed(true);
    }

    checkNotificationStatus();

    setReady(true);
  }, []);

  const checkNotificationStatus = () => {
    if (!("Notification" in window)) {
      setNotificationStatus("blocked");
      return;
    }

    const permission = Notification.permission;
    setNotificationStatus(permission as NotificationStatus);
  };

  const dismissForDays = (days = DISMISS_DAYS_DEFAULT) => {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_UNTIL_KEY, String(until));
    setDismissed(true);
  };

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission as NotificationStatus);

      if (permission === "granted") {
        console.log("Push notification enabled");

        setDismissed(true);
        localStorage.removeItem(DISMISS_UNTIL_KEY);
      } else if (permission === "denied") {
        setShowDialog(true);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setShowDialog(true);
    }
  };

  const handleOpenSettings = () => {
    alert(
      "Para ativar notificações:\n\n" +
        "Chrome/Edge: Clique no ícone de cadeado na barra de endereço → Configurações do site → Notificações → Permitir\n\n" +
        "Firefox: Clique no ícone de cadeado → Configurações de notificações → Permitir\n\n" +
        "Safari: Preferências → Sites → Notificações → Permitir para este site"
    );
  };

  if (!ready) return null;

  if (dismissed || notificationStatus === "granted") {
    return null;
  }

  // Banner para status default (nunca perguntou)
  if (notificationStatus === "default") {
    return (
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-center gap-4 py-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
          <div className="flex-1">
            <p className="font-medium text-foreground">
              Ative as notificações para receber alertas
            </p>
            <p className="text-sm text-muted-foreground">
              Receba notificações instantâneas quando seus preços alvo forem
              atingidos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => dismissForDays(7)}>
              Depois
            </Button>
            <Button size="sm" onClick={handleRequestPermission}>
              <Bell className="mr-2 h-4 w-4" />
              Ativar agora
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Banner para notificações bloqueadas/negadas
  if (notificationStatus === "denied" || notificationStatus === "blocked") {
    return (
      <>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <BellOff className="h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-foreground">
                Notificações bloqueadas
              </p>
              <p className="text-sm text-muted-foreground">
                {notificationStatus === "blocked"
                  ? "Seu navegador não suporta notificações push ou está bloqueado."
                  : "Você bloqueou as notificações. Para receber alertas, é necessário ativar nas configurações do navegador."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissForDays(7)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleOpenSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Como ativar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog com instruções */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Como ativar notificações</DialogTitle>
              <DialogDescription>
                Siga as instruções abaixo para ativar notificações no seu
                navegador
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-semibold text-foreground">
                  Google Chrome / Microsoft Edge
                </h4>
                <ol className="list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
                  <li>
                    Clique no ícone de <strong>cadeado</strong> na barra de
                    endereço
                  </li>
                  <li>Clique em "Configurações do site"</li>
                  <li>Em "Notificações", selecione "Permitir"</li>
                  <li>Recarregue a página</li>
                </ol>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-semibold text-foreground">
                  Mozilla Firefox
                </h4>
                <ol className="list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
                  <li>
                    Clique no ícone de <strong>cadeado</strong> na barra de
                    endereço
                  </li>
                  <li>Clique em "Configurações de notificações"</li>
                  <li>Remova o bloqueio e permita notificações</li>
                  <li>Recarregue a página</li>
                </ol>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-semibold text-foreground">
                  Safari (macOS)
                </h4>
                <ol className="list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
                  <li>Abra Safari → Preferências</li>
                  <li>Vá para a aba "Sites" → "Notificações"</li>
                  <li>Encontre investalerta.com e selecione "Permitir"</li>
                  <li>Recarregue a página</li>
                </ol>
              </div>

              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <div className="text-sm text-muted-foreground">
                    <strong>Importante:</strong> Sem notificações ativas, você
                    não receberá alertas em tempo real quando os preços
                    atingirem seus alvos. O app funcionará, mas você precisará
                    verificar manualmente.
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Entendi
              </Button>
              <Button onClick={() => window.location.reload()}>
                Recarregar página
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
}

// Componente menor para usar em outras páginas
export function NotificationStatusBadge() {
  const [status, setStatus] = useState<NotificationStatus>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setStatus(Notification.permission as NotificationStatus);
    } else {
      setStatus("blocked");
    }
  }, []);

  if (status === "granted") {
    return (
      <Badge variant="default" className="gap-1">
        <Bell className="h-3 w-3" />
        Notificações ativas
      </Badge>
    );
  }

  if (status === "denied" || status === "blocked") {
    return (
      <Badge variant="destructive" className="gap-1">
        <BellOff className="h-3 w-3" />
        Notificações bloqueadas
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <AlertTriangle className="h-3 w-3" />
      Notificações desativadas
    </Badge>
  );
}
