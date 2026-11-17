/** Server runtime (Docker) first; NEXT_PUBLIC is baked in at build for client. */
const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

export type DbHealth = {
  ok: true;
  postgis: string | null;
};

export type BarrierCategory = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type BarrierStatus = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type BarrierNearby = {
  id: string;
  description: string;
  source: string;
  is_temporary: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  category_code: string;
  category_name: string;
  status_code: string;
  status_name: string;
  lat: number;
  lng: number;
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
    credentials: "include",
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

export async function getCategories(): Promise<BarrierCategory[]> {
  return apiFetch<BarrierCategory[]>("/meta/categories");
}

export async function getNearbyBarriers(
  lat: number,
  lng: number,
  radiusMeters = 800,
): Promise<BarrierNearby[]> {
  const q = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radiusMeters: String(radiusMeters),
  });
  return apiFetch<BarrierNearby[]>(`/barriers?${q}`);
}