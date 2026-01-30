"use client";

import React, { useEffect, useMemo, useState } from "react";
import { GlobalDelayNotice } from "@/components/price-delay-components";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  LayoutDashboard,
  LineChart,
  Bell,
  Newspaper,
  Settings,
  Menu,
  LogOut,
  User,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showConfirmToast } from "@/components/ui/custom-toast";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface Window {
    __pwaDeferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Ativos", href: "/app/ativos", icon: LineChart },
  { name: "Alertas", href: "/app/alertas", icon: Bell },
  { name: "Noticias", href: "/app/noticias", icon: Newspaper },
  { name: "Configuracoes", href: "/app/configuracoes", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // PWA install
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    const ios = /iphone|ipad|ipod/i.test(ua);
    setIsIOS(ios);

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS standalone
      window.navigator?.standalone === true;

    setIsInstalled(Boolean(standalone));

    // Se já capturamos antes (outra navegação), reaproveita
    if (window.__pwaDeferredPrompt) {
      setDeferredPrompt(window.__pwaDeferredPrompt);
    }

    const onBeforeInstallPrompt = (e: Event) => {
      // Necessário para permitir usar prompt() depois
      e.preventDefault();

      const evt = e as BeforeInstallPromptEvent;
      window.__pwaDeferredPrompt = evt;
      setDeferredPrompt(evt);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      window.__pwaDeferredPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const showInstallItem = useMemo(() => {
    if (isInstalled) return false;
    if (isIOS) return true;
    return !!deferredPrompt;
  }, [isInstalled, isIOS, deferredPrompt]);

  const handleInstallClick = async () => {
    // iOS sempre manual
    if (isIOS) {
      setShowInstallHelp(true);
      return;
    }

    // Chrome/Edge: só funciona se capturamos o beforeinstallprompt
    const promptEvent = deferredPrompt || window.__pwaDeferredPrompt || null;

    if (!promptEvent) {
      // não dá pra disparar via JS — sem esse evento, não existe como "clicar no ícone do Chrome"
      setShowInstallHelp(true);
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;

    // Após usar, o evento não pode ser reutilizado
    window.__pwaDeferredPrompt = null;
    setDeferredPrompt(null);

    // Se aceitou, o evento appinstalled deve marcar instalado
    if (choice.outcome === "accepted") {
      // ok
    }
  };

  const handleLogout = () => {
    showConfirmToast({
      title: "Sair da conta?",
      description: "Tem certeza que deseja encerrar sua sessao?",
      confirmLabel: "Sim, sair",
      cancelLabel: "Cancelar",
      onConfirm: () => {
        localStorage.clear();
        router.push("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <TrendingUp className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">InvestAlerta</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          {showInstallItem && (
            <button
              type="button"
              onClick={handleInstallClick}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Download className="h-5 w-5" />
              Instalar app
            </button>
          )}
        </nav>

        {/* User Profile + Logout - Desktop */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary">
              <User className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {mockUser.name}
              </p>
              <Badge variant="secondary" className="mt-1 text-xs">
                Plano {mockUser.plan === "free" ? "Gratuito" : mockUser.plan}
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-sidebar-border bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/70"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/app/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">InvestAlerta</span>
        </Link>

        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <TrendingUp className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                <span className="font-bold text-sidebar-foreground">
                  InvestAlerta
                </span>
              </div>

              <nav className="space-y-1 p-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* ✅ Instalar App (PWA) - Mobile */}
                {showInstallItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleInstallClick();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Download className="h-5 w-5" />
                    Instalar app
                  </button>
                )}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4 space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary">
                    <User className="h-5 w-5 text-sidebar-primary-foreground" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-sidebar-foreground">
                      {mockUser.name}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Plano{" "}
                      {mockUser.plan === "free" ? "Gratuito" : mockUser.plan}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-sidebar-border bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/70"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="fixed top-0 right-0 left-64 z-40 hidden h-16 items-center justify-between border-b border-border bg-background px-6 lg:flex">
        <GlobalDelayNotice />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {mockUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {mockUser.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/configuracoes">
                <Settings className="mr-2 h-4 w-4" />
                Configuracoes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-screen pt-0 lg:pt-16 pb-16 lg:pb-0">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background lg:hidden">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Dialog de instruções / fallback */}
      <Dialog open={showInstallHelp} onOpenChange={setShowInstallHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instalar InvestAlerta</DialogTitle>
            <DialogDescription>
              {isIOS
                ? "No iPhone/iPad a instalação é manual pelo Safari."
                : "Se o prompt não apareceu, use o botão instalar do Chrome (na barra) ou o menu do navegador."}
            </DialogDescription>
          </DialogHeader>

          {isIOS ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                1) Toque em <strong>Compartilhar</strong> (quadrado com seta pra
                cima)
              </p>
              <p>
                2) Selecione <strong>Adicionar à Tela de Início</strong>
              </p>
              <p>
                3) Confirme em <strong>Adicionar</strong>
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Quando o navegador libera, o botão do menu abre o prompt
                automaticamente. Se hoje não liberou, o jeito garantido é pelo
                ícone de instalar do Chrome/Edge.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInstallHelp(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
