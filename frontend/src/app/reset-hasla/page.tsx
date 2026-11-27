"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function ResetHaslaPage() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (res.error) throw new Error(res.error.message ?? "Reset nieudany");
      router.push("/logowanie");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd resetu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 py-16">
      <Link href="/" className="font-heading text-lg font-semibold">
        BezBarier
      </Link>
      <h1 className="mt-10 font-heading text-3xl font-semibold tracking-tight">
        Nowe hasło
      </h1>
      {!token ? (
        <p className="mt-4 text-sm text-destructive">
          Brak tokenu w URL. Weź link z logów backendu.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Nowe hasło
            <input
              type="password"
              required
              minLength={8}
              className="rounded-md border border-border bg-background px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Zapisywanie…" : "Ustaw hasło"}
          </Button>
        </form>
      )}
    </main>
  );
}