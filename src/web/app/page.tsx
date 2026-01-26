import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  TrendingUp,
  Newspaper,
  Clock,
  Shield,
  Smartphone,
  ArrowRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import { plans, formatCurrency } from "@/lib/mock-data";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              InvestAlerta
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Como funciona
            </Link>
            <Link
              href="#precos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Precos
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Entrar
            </Link>
            <Button asChild>
              <Link href="/cadastro">Criar conta gratis</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium"
            >
              Bolsa de Valores Brasileira - B3
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground text-balance md:text-6xl">
              Alertas de preco e resumo diario com IA da sua watchlist
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty">
              Acompanhe suas acoes favoritas, receba notificacoes quando o preco
              atingir seu alvo e tenha um resumo diario das principais noticias
              gerado por inteligencia artificial.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/cadastro">
                  Criar conta gratis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#como-funciona">Saiba mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-card-foreground">
              Como funciona
            </h2>
            <p className="text-muted-foreground">
              Em 3 passos simples voce comeca a acompanhar seus investimentos
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Escolha seus ativos
              </h3>
              <p className="text-muted-foreground">
                Busque e adicione acoes e FIIs a sua watchlist personalizada
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Defina alertas
              </h3>
              <p className="text-muted-foreground">
                Configure alertas de preco para ser notificado quando atingir
                seu alvo
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Newspaper className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Receba resumos
              </h3>
              <p className="text-muted-foreground">
                Todo dia receba um resumo das principais noticias gerado por IA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Diferenciais
            </h2>
            <p className="text-muted-foreground">
              Funcionalidades pensadas para investidores que querem praticidade
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">
                  Anti-spam
                </h3>
                <p className="text-sm text-muted-foreground">
                  Alertas inteligentes que evitam notificacoes repetidas em
                  curto periodo
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">
                  Delay transparente
                </h3>
                <p className="text-sm text-muted-foreground">
                  Informamos claramente o atraso de 5-15 minutos nas cotacoes
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Newspaper className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">
                  Fontes citadas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Todo resumo inclui links para as fontes originais das noticias
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">
                  PWA Responsivo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Instale no seu celular como um app nativo e use offline
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Bell className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">
                  Push notifications
                </h3>
                <p className="text-sm text-muted-foreground">
                  Receba alertas em tempo real direto no seu dispositivo
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">
                  IA generativa
                </h3>
                <p className="text-sm text-muted-foreground">
                  Resumos inteligentes das noticias mais relevantes do mercado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-card-foreground">
              Planos
            </h2>
            <p className="text-muted-foreground">
              Escolha o plano ideal para voce
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-border ${plan.id === "intermediate" ? "ring-2 ring-primary" : ""}`}
              >
                {plan.id === "intermediate" && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais popular
                  </Badge>
                )}
                <CardContent className="pt-8">
                  <h3 className="mb-2 text-xl font-bold text-card-foreground">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-card-foreground">
                      {plan.price === 0 ? "Gratis" : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mes</span>
                    )}
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.id === "intermediate" ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/cadastro">Comecar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="flex items-start gap-4 pt-6">
              <AlertTriangle className="h-6 w-6 shrink-0 text-warning" />
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Aviso importante
                </h3>
                <p className="text-sm text-muted-foreground">
                  Este servico e apenas informativo e nao constitui
                  recomendacao de investimento. As cotacoes podem apresentar
                  atraso de 5 a 15 minutos em relacao ao mercado. Consulte
                  sempre um profissional certificado antes de tomar decisoes de
                  investimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-card-foreground">
                InvestAlerta
              </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/termos"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Termos de uso
              </Link>
              <Link
                href="/privacidade"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacidade
              </Link>
              <Link
                href="mailto:contato@investalerta.com"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contato
              </Link>
            </nav>

            <p className="text-sm text-muted-foreground">
              2026 InvestAlerta. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
