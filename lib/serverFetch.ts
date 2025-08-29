// lib/serverFetch.ts
import { cookies } from "next/headers";
import { getSessionToken } from "./cookies.server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.chantiersync.com/api";

/**
 * Récupère le token de session depuis les cookies et appelle l'API
 * @param endpoint API endpoint (ex: "/users")
 * @param options fetch options
 */
export async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Récupérer le token stocké en cookie HttpOnly
  const token = await getSessionToken();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}
