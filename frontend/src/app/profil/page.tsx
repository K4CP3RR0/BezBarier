"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/require-auth";
import { authClient } from "@/lib/auth-client";
import {
  getMyRoles,
  getRoles,
  setPrimaryRole,
  type AppRole,
  type MyRole,
} from "@/lib/api";

export default function ProfilPage() {
  return (
    <Suspense
      fallback={
        <p className="px-6 py-16 text-sm text-muted-foreground">
          Sprawdzam sesję…
        </p>
      }
    >
      <RequireAuth>
        <ProfilInner />
      </RequireAuth>
    </Suspense>
  );
}

function ProfilInner() {
  const { data: session } = authClient.useSession();
  const [allRoles, setAllRoles] = useState<AppRole[]>([]);
  const [mine, setMine] = useState<MyRole[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([getRoles(), getMyRoles()])
      .then(([roles, my]) => {
        setAllRoles(roles);
        setMine(my);
        const primary = my.find((r) => r.isPrimary);
        setSelected(primary?.code ?? roles[0]?.code ?? "");
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Błąd ról"),
      );
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const updated = await setPrimaryRole(selected);
      setMine(updated);
      setInfo("Zapisano rolę główną.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zapisać");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <Link href="/mapa" className="font-heading text-lg font-semibold">
          BezBarier
        </Link>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={async () => {
            await authClient.signOut();
            window.location.href = "/logowanie";
          }}
        >
          Wyloguj
        </Button>
      </div>

      <h1 className="mt-10 font-heading text-3xl font-semibold tracking-tight">
        Profil
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{session?.user.email}</p>

      <form onSubmit={onSave} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Rola dostępności
          <select
            className="rounded-md border border-border bg-background px-3 py-2"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required
          >
            {allRoles.map((r) => (
              <option key={r.id} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        {mine.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Teraz:{" "}
            {mine
              .filter((r) => r.isPrimary)
              .map((r) => r.name)
              .join(", ") || "brak głównej"}
          </p>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {info ? <p className="text-sm text-muted-foreground">{info}</p> : null}

        <Button type="submit" size="lg" disabled={busy || !selected}>
          {busy ? "Zapisywanie…" : "Zapisz rolę"}
        </Button>
      </form>
    </main>
  );
}