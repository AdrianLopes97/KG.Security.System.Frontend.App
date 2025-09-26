// biome-ignore assist/source/organizeImports: true
import logo from "@/assets/login-icon.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useId } from "react";

export function Login() {
  const emailId = useId();
  const passwordId = useId();
  return (
    <div className="grid min-h-svh w-full place-items-center bg-background px-4 py-10">
      <Card className="w-full max-w-[480px] border border-border/70">
        <CardHeader className="flex flex-col items-center text-center">
          <div>
            <img src={logo} alt="KG SECSYSTEM" />
          </div>
          <CardDescription className="text-xs sm:text-sm">Sistema de Monitoramento de Vulnerabilidades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-medium text-sm">Faça login na sua conta</h2>
            <p className="font-regular text-muted-foreground text-xs">
              Digite seu e-mail e senha para acessar sua conta
            </p>
          </div>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label htmlFor={emailId} className="font-medium text-foreground/90 text-xs tracking-wide">
                Email
              </label>
              <input
                id={emailId}
                type="email"
                placeholder="Seu e-mail"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={passwordId} className="font-medium text-foreground/90 text-xs tracking-wide">
                  Senha
                </label>
                <button
                  type="button"
                  className="font-medium text-[11px] text-primary hover:underline focus-visible:outline-none"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <input
                id={passwordId}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full font-medium text-sm tracking-wide">
              Entrar
            </Button>
          </form>
          <p className="pt-1 text-center text-muted-foreground text-xs">
            Não tem uma conta?{" "}
            <button type="button" className="font-medium text-primary hover:underline">
              Cadastre-se
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
