"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Bell,
  Crown,
  Trash2,
  Check,
  AlertTriangle,
  Mail,
  Shield,
  Clock,
  HelpCircle,
} from "lucide-react";
import { mockUser, plans, formatCurrency } from "@/lib/mock-data";

export default function ConfiguracoesPage() {
  const [user, setUser] = useState(mockUser);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const currentPlan = plans.find((p) => p.id === user.plan) || plans[0];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-muted-foreground">
          Gerencie sua conta e preferencias
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Perfil</CardTitle>
          </div>
          <CardDescription>Informacoes da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar alteracoes</Button>
        </CardFooter>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notificacoes</CardTitle>
          </div>
          <CardDescription>Configure suas preferencias de alerta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificacoes push</Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas de preco no navegador/celular
              </p>
            </div>
            <Switch
              checked={user.notificationsEnabled}
              onCheckedChange={(checked) =>
                setUser({ ...user, notificationsEnabled: checked })
              }
            />
          </div>

          {!user.notificationsEnabled && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium text-foreground">
                    Notificacoes desativadas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sem notificacoes push, voce nao recebera alertas de preco em
                    tempo real. Ative para aproveitar ao maximo o InvestAlerta.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Daily Summary */}
          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumo diario</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo das noticias todos os dias
                </p>
              </div>
              <Switch
                checked={user.dailySummaryEnabled}
                onCheckedChange={(checked) =>
                  setUser({ ...user, dailySummaryEnabled: checked })
                }
              />
            </div>

            {user.dailySummaryEnabled && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label>Horario de envio</Label>
                </div>
                <Select
                  value={user.dailySummaryTime}
                  onValueChange={(value) =>
                    setUser({ ...user, dailySummaryTime: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                    <SelectItem value="19:00">19:00</SelectItem>
                    <SelectItem value="20:00">20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar preferencias</Button>
        </CardFooter>
      </Card>

      {/* Plan Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Seu plano</CardTitle>
          </div>
          <CardDescription>
            Gerencie sua assinatura e limite de ativos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    Plano {currentPlan.name}
                  </h3>
                  <Badge variant="secondary">Atual</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentPlan.price === 0
                    ? "Gratis"
                    : `${formatCurrency(currentPlan.price)}/mes`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Limite de ativos
                </p>
                <p className="text-2xl font-bold text-primary">
                  {currentPlan.watchlistLimit}
                </p>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div>
            <h4 className="mb-3 font-medium text-foreground">
              Recursos do seu plano
            </h4>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrade Options */}
          {user.plan !== "gold" && (
            <div className="border-t border-border pt-6">
              <h4 className="mb-4 font-medium text-foreground">
                Faca upgrade para mais recursos
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {plans
                  .filter((p) => p.id !== "free" && p.id !== user.plan)
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h5 className="font-semibold text-foreground">
                          {plan.name}
                        </h5>
                        <span className="font-bold text-foreground">
                          {formatCurrency(plan.price)}/mes
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Ate {plan.watchlistLimit} ativos
                        {!plan.hasAds && ", sem anuncios"}
                      </p>
                      <Button className="w-full" size="sm">
                        Fazer upgrade
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Legal e suporte</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Termos de uso</p>
                <p className="text-sm text-muted-foreground">
                  Leia nossos termos e condicoes
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/termos">Ver</Link>
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">
                  Politica de privacidade
                </p>
                <p className="text-sm text-muted-foreground">
                  Como protegemos seus dados
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/privacidade">Ver</Link>
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Suporte</p>
                <p className="text-sm text-muted-foreground">
                  contato@investalerta.com
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="mailto:contato@investalerta.com">Contato</a>
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Ajuda</p>
                <p className="text-sm text-muted-foreground">
                  Perguntas frequentes e tutoriais
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Ver
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-4 pt-6">
          <AlertTriangle className="h-6 w-6 shrink-0 text-warning" />
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              Aviso importante
            </h3>
            <p className="text-sm text-muted-foreground">
              O InvestAlerta e um servico informativo e nao constitui
              recomendacao de investimento. As cotacoes podem apresentar atraso
              de 5 a 15 minutos em relacao ao mercado. Consulte sempre um
              profissional certificado antes de tomar decisoes de investimento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Zona de perigo</CardTitle>
          </div>
          <CardDescription>
            Acoes irreversiveis para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div>
              <p className="font-medium text-foreground">Excluir conta</p>
              <p className="text-sm text-muted-foreground">
                Remover permanentemente sua conta e todos os dados
              </p>
            </div>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Excluir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Excluir conta</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir sua conta? Esta acao e
                    irreversivel e todos os seus dados serao permanentemente
                    removidos.
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    Voce perdera:
                  </p>
                  <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                    <li>Todos os ativos monitorados</li>
                    <li>Todos os alertas configurados</li>
                    <li>Historico de notificacoes</li>
                    <li>Preferencias salvas</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="destructive">
                    Sim, excluir minha conta
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
