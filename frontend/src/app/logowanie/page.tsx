"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function LogowanieContent() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/mapa";

  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "reset") {
        const res = await authClient.requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/reset-hasla`,
        });
        if (res.error) throw new Error(res.error.message ?? "Reset nieudany");
        setInfo(
          "Jeśli konto istnieje, link resetu jest w logach backendu (MVP bez SMTP).",
        );
        return;
      }

      if (mode === "register") {
        const res = await authClient.signUp.email({
          name: name.trim() || email,
          email,
          password,
        });
        if (res.error)
          throw new Error(res.error.message ?? "Rejestracja nieudana");
        setInfo(
          "Konto utworzone. Link weryfikacji maila jest w logach backendu.",
        );
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error)
          throw new Error(res.error.message ?? "Logowanie nieudane");
      }
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd auth");
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "login"
      ? "Zaloguj się"
      : mode === "register"
        ? "Załóż konto"
        : "Reset hasła";

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 py-16">
      <Link
        href="/"
        className="font-heading text-lg font-semibold text-foreground"
      >
        BezBarier
      </Link>
      <h1 className="mt-10 font-heading text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Mapa i zgłoszenia wymagają konta.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        {mode === "register" ? (
          <label className="flex flex-col gap-1 text-sm">
            Imię
            <input
              className="rounded-md border border-border bg-background px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            className="rounded-md border border-border bg-background px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        {mode !== "reset" ? (
          <label className="flex flex-col gap-1 text-sm">
            Hasło
            <input
              type="password"
              required
              minLength={8}
              className="rounded-md border border-border bg-background px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {info ? <p className="text-sm text-muted-foreground">{info}</p> : null}

        <Button type="submit" size="lg" disabled={loading}>
          {loading
            ? "Chwila…"
            : mode === "login"
              ? "Zaloguj"
              : mode === "register"
                ? "Zarejestruj"
                : "Wyślij link resetu"}
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
        {mode !== "login" ? (
          <button
            type="button"
            className="text-left underline-offset-4 hover:underline"
            onClick={() => setMode("login")}
          >
            Wróć do logowania
          </button>
        ) : null}
        {mode === "login" ? (
          <>
            <button
              type="button"
              className="text-left underline-offset-4 hover:underline"
              onClick={() => setMode("register")}
            >
              Nie masz konta? Zarejestruj się
            </button>
            <button
              type="button"
              className="text-left underline-offset-4 hover:underline"
              onClick={() => setMode("reset")}
            >
              Nie pamiętam hasła
            </button>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default function LogowaniePage() {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-16 text-sm text-muted-foreground">Ładowanie…</p>
      }
    >
      <LogowanieContent />
    </Suspense>
  );
}
