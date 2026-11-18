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

export type CreateBarrierPayload = {
  categoryCode: string;
  description: string;
  lat: number;
  lng: number;
  source?: "VOICE" | "MANUAL" | "PHOTO";
  isTemporary?: boolean;
  expiresAt?: string | null;
  gpsAccuracyM?: number | null;
};

export type VerificationAction = "CONFIRM" | "DENY" | "RESOLVED";

export type CreateVerificationPayload = {
  action: VerificationAction;
  note?: string | null;
  photoStorageKey?: string | null;
};

export type CreateVoiceNotePayload = {
  transcriptionText: string;
  rawTranscript?: string | null;
  audioStorageKey?: string | null;
  lat?: number | null;
  lng?: number | null;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public path: string,
    public body: unknown,
  ) {
    super(formatApiErrorMessage(status, path, body));
    this.name = "ApiError";
  }
}

function formatApiErrorMessage(
  status: number,
  path: string,
  body: unknown,
): string {
  if (typeof body === "object" && body && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message.trim()) return message;
  }
  if (typeof body === "string" && body.trim()) return body;
  return `API ${status}: ${path}`;
}

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
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (init?.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      try {
        body = await res.text();
      } catch {
        body = null;
      }
    }
    throw new ApiError(res.status, path, body);
  }

  if (res.status === 204) return undefined as T;
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

export async function createBarrier(
  payload: CreateBarrierPayload,
): Promise<BarrierNearby> {
  return apiFetch<BarrierNearby>("/barriers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createVerification(
  barrierId: string,
  payload: CreateVerificationPayload,
) {
  return apiFetch(`/barriers/${barrierId}/verifications`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createVoiceNote(
  barrierId: string,
  payload: CreateVoiceNotePayload,
) {
  return apiFetch(`/barriers/${barrierId}/voice-notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadFile(
  file: File,
  kind: "photo" | "audio" = "photo",
): Promise<{ key: string }> {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<{ key: string }>(`/uploads?kind=${kind}`, {
    method: "POST",
    body,
  });
}
