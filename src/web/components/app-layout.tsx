"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Ativos", href: "/app/ativos", icon: LineChart },
  { name: "Alertas", href: "/app/alertas", icon: Bell },
  { name: "Noticias", href: "/app/noticias", icon: Newspaper },
  { name: "Configuracoes", href: "/app/configuracoes", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        </nav>

        <div className="border-t border-sidebar-border p-4">
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
              </nav>

              <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="fixed top-0 right-0 left-64 z-40 hidden h-16 items-center justify-between border-b border-border bg-background px-6 lg:flex">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Ultima atualizacao: 14:35 (delay ~15 min)</span>
        </div>

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
            <DropdownMenuItem asChild>
              <Link href="/login" className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="min-h-screen pt-16 lg:pt-16">
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
    </div>
  );
}
