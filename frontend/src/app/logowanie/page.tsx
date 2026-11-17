"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LogowaniePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await authClient.signUp.email({
          name: name.trim() || email,
          email,
          password,
        });
        if (res.error) throw new Error(res.error.message ?? "Rejestracja nieudana");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message ?? "Logowanie nieudane");
      }
      router.push("/mapa");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd auth");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 py-16">
      <Link href="/" className="font-heading text-lg font-semibold text-foreground">
        BezBarier
      </Link>
      <h1 className="mt-10 font-heading text-3xl font-semibold tracking-tight">
        {mode === "login" ? "Zaloguj się" : "Załóż konto"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Konto potrzebne do zgłoszeń i weryfikacji barier.
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
        <label className="flex flex-col gap-1 text-sm">
          Hasło
          <input
            type="password"
            required
            minLength={8}
            className="rounded-md border border-border bg-background px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Chwila…" : mode === "login" ? "Zaloguj" : "Zarejestruj"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-6 text-left text-sm text-muted-foreground underline-offset-4 hover:underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "Nie masz konta? Zarejestruj się"
          : "Masz konto? Zaloguj się"}
      </button>
    </main>
  );
}