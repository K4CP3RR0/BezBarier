"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getNearbyBarriers, type BarrierNearby } from "@/lib/api";

export default function MapaPage() {
  const { data: session } = authClient.useSession();
  const [barriers, setBarriers] = useState<BarrierNearby[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Brak geolokalizacji w przeglądarce");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        try {
          const rows = await getNearbyBarriers(lat, lng, 1000);
          setBarriers(rows);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Nie udało się pobrać barier (migracja/API?)",
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Nie udało się pobrać lokalizacji");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="font-heading text-lg font-semibold">
          BezBarier
        </Link>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          ) : (
            <Button size="lg" render={<Link href="/logowanie" />} nativeButton={false}>
              Zaloguj
            </Button>
          )}
        </div>
      </div>

      <h1 className="mt-10 font-heading text-3xl font-semibold tracking-tight">
        Bariery w okolicy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Lista z API (MVP). Mapa kafelkowa dojdzie później.
      </p>

      {coords ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Twoja pozycja: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Ładowanie…</p>
      ) : null}
      {error ? <p className="mt-8 text-sm text-destructive">{error}</p> : null}

      {!loading && !error ? (
        <ul className="mt-8 flex flex-col gap-6">
          {barriers.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Brak barier w promieniu 1 km (albo pusta baza).
            </li>
          ) : (
            barriers.map((b) => (
              <li key={b.id} className="border-t border-border/80 pt-4">
                <p className="font-heading text-lg font-semibold">{b.category_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {b.status_name} · {Number(b.lat).toFixed(5)}, {Number(b.lng).toFixed(5)}
                </p>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </main>
  );
}