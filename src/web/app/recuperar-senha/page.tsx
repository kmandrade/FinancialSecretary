"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { TrendingUp, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/custom-toast";
import { ButtonLoading } from "@/components/ui/loading";

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setEmailSent(true);
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Email reenviado", "Verifique sua caixa de entrada");
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
        {!emailSent ? (
          <>
            <CardHeader className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 w-fit"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <CardTitle className="text-2xl font-bold">
                Recuperar senha
              </CardTitle>
              <CardDescription>
                Digite seu email para receber um link de recuperação
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">
                        Como funciona?
                      </p>
                      <p className="mt-1">
                        Você receberá um email com um link seguro para criar uma
                        nova senha. O link expira em 1 hora.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <ButtonLoading className="mr-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperacao"
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Lembrou sua senha?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Fazer login
                  </Link>
                </p>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Email enviado!
              </CardTitle>
              <CardDescription>
                Verifique sua caixa de entrada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de recuperação para:
                </p>
                <p className="mt-1 font-medium text-foreground">{email}</p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">O que fazer agora?</p>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Abra seu email</li>
                  <li>Procure por uma mensagem do InvestAlerta</li>
                  <li>Clique no link de recuperação</li>
                  <li>Crie uma nova senha</li>
                </ol>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">
                  Não recebeu o email?
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Verifique sua pasta de spam ou lixo eletrônico</li>
                  <li>• Aguarde alguns minutos, pode demorar um pouco</li>
                  <li>• Certifique-se de que digitou o email correto</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendEmail}
                disabled={isLoading}
              >
                {isLoading ? <ButtonLoading className="mr-2" /> : null}
                Reenviar email
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Link>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
