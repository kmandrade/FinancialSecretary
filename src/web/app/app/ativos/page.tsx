"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  X,
  Trash2,
} from "lucide-react";
import {
  mockStocks,
  mockUserWatchlist,
  mockUser,
  formatCurrency,
  formatPercent,
  formatDateTime,
} from "@/lib/mock-data";
import type { Stock } from "@/lib/types";
import { PriceDelayBadge } from "@/components/price-delay-components";

export default function AtivosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState<Stock[]>(mockUserWatchlist);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const availableStocks = mockStocks.filter(
    (stock) =>
      !watchlist.some((w) => w.ticker === stock.ticker) &&
      (stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToWatchlist = (stock: Stock) => {
    if (watchlist.length >= mockUser.watchlistLimit) {
      alert(
        `Limite de ${mockUser.watchlistLimit} ativos atingido. Faca upgrade do seu plano para adicionar mais.`
      );
      return;
    }
    setWatchlist([...watchlist, stock]);
    setSearchQuery("");
    setIsAddDialogOpen(false);
  };

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter((s) => s.ticker !== ticker));
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus ativos</h1>
          <p className="text-muted-foreground">
            Gerencie sua watchlist de acoes e FIIs
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar ativo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar ativo</DialogTitle>
              <DialogDescription>
                Busque por ticker ou nome da empresa. Limite:{" "}
                {watchlist.length}/{mockUser.watchlistLimit}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ticker ou nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {searchQuery.length > 0 ? (
                  availableStocks.length > 0 ? (
                    availableStocks.map((stock) => (
                      <button
                        key={stock.ticker}
                        onClick={() => addToWatchlist(stock)}
                        className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
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
                          <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="gap-1 text-xs">
                            {formatPercent(stock.changePercent)}
                          </Badge>
                          <PriceDelayBadge lastUpdate={stock.lastUpdate} variant="compact" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Nenhum ativo encontrado
                    </p>
                  )
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    Digite para buscar ativos
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plan limit warning */}
      {watchlist.length >= mockUser.watchlistLimit && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-foreground">Limite atingido</p>
              <p className="text-sm text-muted-foreground">
                Voce atingiu o limite de {mockUser.watchlistLimit} ativos do
                plano {mockUser.plan === "free" ? "gratuito" : mockUser.plan}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/configuracoes">Fazer upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Watchlist */}
      {watchlist.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Voce ainda nao acompanha nenhum ativo
            </h3>
            <p className="mb-6 text-muted-foreground">
              Adicione acoes ou FIIs a sua watchlist para comecar a monitorar
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeiro ativo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((stock) => (
            <Card key={stock.ticker} className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeFromWatchlist(stock.ticker)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Remover</span>
              </Button>
              <Link href={`/app/ativos/${stock.ticker}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                      {stock.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{stock.ticker}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {stock.name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(stock.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Atualizado: {formatDateTime(stock.lastUpdate)}
                      </p>
                    </div>
                    <Badge
                      variant={stock.change >= 0 ? "default" : "destructive"}
                      className="gap-1"
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {formatPercent(stock.changePercent)}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Badge variant="secondary" className="text-xs">
                      {stock.sector}
                    </Badge>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
