"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      setShowTermsDialog(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas nao coincidem");
      return;
    }

    setIsLoading(true);

    // Simular cadastro
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push("/app/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">InvestAlerta</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Comece a acompanhar seus investimentos gratuitamente
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ocultar senha" : "Mostrar senha"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            {/* Terms Warning */}
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Aviso importante</p>
                  <p className="mt-1 text-muted-foreground">
                    Este servico e apenas informativo e nao constitui
                    recomendacao de investimento. As cotacoes podem apresentar
                    atraso de 5 a 15 minutos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptTerms: checked as boolean })
                }
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight text-muted-foreground"
              >
                Li e aceito os{" "}
                <Link href="/termos" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link
                  href="/privacidade"
                  className="text-primary hover:underline"
                >
                  Politica de Privacidade
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar conta
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Ja tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Terms Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aceite os termos</DialogTitle>
            <DialogDescription>
              Para criar sua conta, voce precisa aceitar os Termos de Uso e a
              Politica de Privacidade.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div className="text-sm text-muted-foreground">
                <p>
                  Este servico e apenas informativo e nao constitui recomendacao
                  de investimento. As cotacoes podem apresentar atraso de 5 a 15
                  minutos em relacao ao mercado.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTermsDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setFormData({ ...formData, acceptTerms: true });
                setShowTermsDialog(false);
              }}
            >
              Aceitar e continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
