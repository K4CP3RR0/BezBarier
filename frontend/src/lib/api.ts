/** Server runtime (Docker) first; NEXT_PUBLIC is baked in at build for client. */
const baseUrl =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export type DbHealth = {
  ok: true;
  postgis: string | null;
};

export function getApiBaseUrl(): string {
  if (!baseUrl) {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL is not set");
  }
  return baseUrl.replace(/\/$/, "");
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getDbHealth(): Promise<DbHealth> {
  return apiFetch<DbHealth>("/health/db");
}
