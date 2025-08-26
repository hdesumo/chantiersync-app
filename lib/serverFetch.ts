// lib/serverFetch.ts
import { getSessionToken } from "@/lib/cookies";

export async function serverApiFetch<T>(path: string, init: RequestInit = {}) {
  // path ex: "/api/enterprises?limit=20" (chemin du backend)
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const token = getSessionToken();

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const r = await fetch(`${base}${path}`, { ...init, headers, cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}
