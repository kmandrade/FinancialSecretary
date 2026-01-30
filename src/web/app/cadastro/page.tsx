"use client";

import React, { useState } from "react";
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
import { TrendingUp, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/custom-toast";
import { ButtonLoading } from "@/components/ui/loading";
import { TermsModal } from "@/components/terms-modal";

export default function CadastroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptDisclaimer: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms || !formData.acceptDisclaimer) {
      setShowTermsModal(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Erro de validacao", "As senhas nao coincidem");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Erro de validacao", "A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    // Simular cadastro
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    toast.success("Conta criada com sucesso!", "Bem-vindo ao InvestAlerta");
    router.push("/app/dashboard");
  };

  const handleAcceptTerms = () => {
    setFormData({
      ...formData,
      acceptTerms: true,
      acceptDisclaimer: true,
    });
    setShowTermsModal(false);
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
                  placeholder="Mínimo 8 caracteres"
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
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            {/* Aviso Compacto */}
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Aviso importante</p>
                  <p className="mt-1 text-muted-foreground">
                    Este serviço é apenas informativo e não constitui
                    recomendação de investimento. Cotações com delay de 5-15 min.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkboxes de Termos */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, acceptTerms: checked as boolean })
                  }
                />
                <label
                  htmlFor="terms"
                  className="cursor-pointer text-sm leading-tight text-muted-foreground"
                >
                  Li e aceito os{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-medium text-primary hover:underline"
                  >
                    Termos de Uso e Política de Privacidade
                  </button>
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="disclaimer"
                  checked={formData.acceptDisclaimer}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      acceptDisclaimer: checked as boolean,
                    })
                  }
                />
                <label
                  htmlFor="disclaimer"
                  className="cursor-pointer text-sm leading-tight text-muted-foreground"
                >
                  Declaro que estou ciente de que este serviço é apenas
                  informativo, as cotações têm delay de 5-15 min, e não constitui
                  recomendação de investimento
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ButtonLoading className="mr-2" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Modal de Termos Completo */}
      <TermsModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onAccept={handleAcceptTerms}
        acceptedTerms={formData.acceptTerms}
        onTermsChange={(checked) =>
          setFormData({ ...formData, acceptTerms: checked })
        }
        acceptedDisclaimer={formData.acceptDisclaimer}
        onDisclaimerChange={(checked) =>
          setFormData({ ...formData, acceptDisclaimer: checked })
        }
      />
    </div>
  );
}
