"use client";


import { BarriersMapDynamic } from "@/components/map/barriers-map-dynamic";
import { StatusLine } from "@/components/ui/status-line";
import { RequireAuth } from "@/require-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  createBarrier,
  createVerification,
  createVoiceNote,
  getCategories,
  getNearbyBarriers,
  uploadFile,
  type BarrierCategory,
  type BarrierNearby,
  type VerificationAction,
} from "@/lib/api";

export default function MapaPage() {
  const { data: session } = authClient.useSession();
  const [barriers, setBarriers] = useState<BarrierNearby[]>([]);
  const [categories, setCategories] = useState<BarrierCategory[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [categoryCode, setCategoryCode] = useState("");
  const [description, setDescription] = useState("");
  const [reportBusy, setReportBusy] = useState(false);
  const [reportMessage, setReportMessage] = useState<string | null>(null);

  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [photoBusyId, setPhotoBusyId] = useState<string | null>(null);
  const [voiceBusyId, setVoiceBusyId] = useState<string | null>(null);
  const [voiceTextById, setVoiceTextById] = useState<Record<string, string>>(
    {},
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function refreshBarriers(lat: number, lng: number) {
    const rows = await getNearbyBarriers(lat, lng, 1000);
    setBarriers(rows);
  }

  useEffect(() => {
    getCategories()
      .then((rows) => {
        setCategories(rows);
        if (rows[0]) setCategoryCode(rows[0].code);
      })
      .catch(() => {
        /* categories optional on first paint */
      });

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
          await refreshBarriers(lat, lng);
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

  async function onReport(e: React.FormEvent) {
    e.preventDefault();
    setReportMessage(null);
    if (!session?.user) {
      setReportMessage("Zaloguj się, żeby zgłosić barierę.");
      return;
    }
    if (!coords) {
      setReportMessage("Brak lokalizacji GPS.");
      return;
    }
    if (!categoryCode || description.trim().length < 3) {
      setReportMessage("Wybierz kategorię i wpisz opis (min. 3 znaki).");
      return;
    }

    setReportBusy(true);
    try {
      await createBarrier({
        categoryCode,
        description: description.trim(),
        lat: coords.lat,
        lng: coords.lng,
        source: "MANUAL",
      });
      setDescription("");
      setReportMessage("Zgłoszenie zapisane.");
      await refreshBarriers(coords.lat, coords.lng);
    } catch (err) {
      setReportMessage(
        err instanceof Error ? err.message : "Nie udało się zgłosić bariery",
      );
    } finally {
      setReportBusy(false);
    }
  }

  async function onVerify(barrierId: string, action: VerificationAction) {
    if (!session?.user) {
      setError("Zaloguj się, żeby weryfikować bariery.");
      return;
    }
    if (!coords) return;

    setActionBusyId(`${barrierId}:${action}`);
    setError(null);
    try {
      await createVerification(barrierId, { action });
      await refreshBarriers(coords.lat, coords.lng);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się zapisać weryfikacji",
      );
    } finally {
      setActionBusyId(null);
    }
  }

  async function onPhotoConfirm(
    barrierId: string,
    file: File | null | undefined,
  ) {
    if (!file || !session?.user || !coords) return;
    setPhotoBusyId(barrierId);
    setError(null);
    try {
      const { key } = await uploadFile(file, "photo");
      await createVerification(barrierId, {
        action: "CONFIRM",
        photoStorageKey: key,
        note: "Potwierdzenie ze zdjęciem",
      });
      await refreshBarriers(coords.lat, coords.lng);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload/potwierdzenie nieudane",
      );
    } finally {
      setPhotoBusyId(null);
    }
  }

  async function onVoiceNote(barrierId: string) {
    if (!session?.user || !coords) return;
    const text = (voiceTextById[barrierId] ?? "").trim();
    if (text.length < 1) {
      setError("Wpisz treść notatki głosowej (transkrypcja).");
      return;
    }

    setVoiceBusyId(barrierId);
    setError(null);
    try {
      await createVoiceNote(barrierId, {
        transcriptionText: text,
        lat: coords.lat,
        lng: coords.lng,
      });
      setVoiceTextById((prev) => ({ ...prev, [barrierId]: "" }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się dodać voice note",
      );
    } finally {
      setVoiceBusyId(null);
    }
  }

  return (
    <RequireAuth>
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="font-heading text-lg font-semibold">
          BezBarier
        </Link>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href="/profil"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {session.user.email}
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
            </>
          ) : null}
          </div>
        </div>

      <h1 className="mt-10 font-heading text-3xl font-semibold tracking-tight">
        Bariery w okolicy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Lista z API (MVP). Zgłoszenia i weryfikacje wymagają sesji.
      </p>

      {coords ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Twoja pozycja: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </p>
      ) : null}

      <div className="mt-6">
        <StatusLine
          loading={loading && !coords}
          error={
            !coords && error
              ? error
              : !loading && !coords
                ? "Brak lokalizacji — mapa niedostępna"
                : null
          }
        />
        {coords ? (
          <BarriersMapDynamic
            lat={coords.lat}
            lng={coords.lng}
            barriers={barriers}
            onSelect={setSelectedId}
          />
        ) : null}
      </div>

      <section className="mt-8 border-t border-border/80 pt-6">
        <h2 className="font-heading text-xl font-semibold">Zgłoś barierę</h2>
        {!session?.user ? (
          <p className="mt-2 text-sm text-muted-foreground">
            <Link href="/logowanie" className="underline underline-offset-4">
              Zaloguj się
            </Link>
            , aby wysłać zgłoszenie (POST + cookie sesji).
          </p>
        ) : (
          <form onSubmit={onReport} className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Kategoria
              <select
                className="rounded-md border border-border bg-background px-3 py-2"
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
                required
              >
                {categories.length === 0 ? (
                  <option value="">Brak kategorii (seed?)</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Opis
              <textarea
                className="min-h-24 rounded-md border border-border bg-background px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minLength={3}
                required
                placeholder="Np. schody bez podjazdu przy wejściu"
              />
            </label>
            {reportMessage ? (
              <p className="text-sm text-muted-foreground">{reportMessage}</p>
            ) : null}
            <Button type="submit" size="lg" disabled={reportBusy || !coords}>
              {reportBusy ? "Wysyłanie…" : "Wyślij zgłoszenie"}
            </Button>
          </form>
        )}
      </section>

      <div className="mt-8">
        <StatusLine
          loading={loading}
          error={error}
          empty={
            !loading && !error && barriers.length === 0
              ? "Brak barier w promieniu 1 km (albo pusta baza)."
              : null
          }
        />
      </div>

      {!loading && barriers.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-8">
          {barriers.map((b) => (
              <li
                id={`barrier-${b.id}`}
                key={b.id}
                className={`border-t border-border/80 pt-4 ${
                  selectedId === b.id ? "bg-secondary/40 px-3" : ""
                }`}
              >
                <p className="font-heading text-lg font-semibold">
                  {b.category_name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {b.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {b.status_name} · {Number(b.lat).toFixed(5)},{" "}
                  {Number(b.lng).toFixed(5)}
                </p>

                {session?.user ? (
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["CONFIRM", "Potwierdź"],
                          ["DENY", "Odrzuć"],
                          ["RESOLVED", "Usunięta"],
                        ] as const
                      ).map(([action, label]) => (
                        <Button
                          key={action}
                          type="button"
                          size="sm"
                          variant={action === "DENY" ? "outline" : "default"}
                          disabled={actionBusyId === `${b.id}:${action}`}
                          onClick={() => onVerify(b.id, action)}
                        >
                          {actionBusyId === `${b.id}:${action}`
                            ? "…"
                            : label}
                        </Button>
                      ))}
                    </div>

                    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                      Zdjęcie + CONFIRM
                      <input
                        type="file"
                        accept="image/*"
                        disabled={photoBusyId === b.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          void onPhotoConfirm(b.id, file);
                        }}
                      />
                      {photoBusyId === b.id ? "Upload…" : null}
                    </label>

                    <div className="flex flex-col gap-2">
                      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                        Voice note (transkrypcja)
                        <input
                          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                          value={voiceTextById[b.id] ?? ""}
                          onChange={(e) =>
                            setVoiceTextById((prev) => ({
                              ...prev,
                              [b.id]: e.target.value,
                            }))
                          }
                          placeholder="Tekst z rozpoznania mowy"
                        />
                      </label>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={voiceBusyId === b.id}
                        onClick={() => onVoiceNote(b.id)}
                      >
                        {voiceBusyId === b.id
                          ? "Zapisywanie…"
                          : "Dodaj voice note"}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </li>
          ))}
        </ul>
      ) : null}
        </main>
        </RequireAuth>
      );
    }
