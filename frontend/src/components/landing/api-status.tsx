import { getDbHealth } from "@/lib/api";

export async function ApiStatus() {
  try {
    const health = await getDbHealth();
    return (
      <p className="text-sm text-muted-foreground" role="status">
        API{" "}
        <span className="text-foreground">połączone</span>
        {health.postgis ? ` · PostGIS ${health.postgis}` : null}
      </p>
    );
  } catch {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        API{" "}
        <span className="text-destructive">niedostępne</span>
        <span className="sr-only">
          . Sprawdź, czy backend działa na NEXT_PUBLIC_API_URL.
        </span>
      </p>
    );
  }
}

export function ApiStatusFallback() {
  return (
    <p className="text-sm text-muted-foreground" role="status" aria-busy="true">
      API · sprawdzanie…
    </p>
  );
}
