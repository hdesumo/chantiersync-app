// lib/api.ts
import { cookies } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

/**
 * Fetch côté client (navigateur)
 */
export async function clientApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch côté serveur (Next.js server components / routes)
 */
export async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = cookies();
  const token = cookieStore.get("cs_session")?.value;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/**
 * Exemple d’API utilitaires pour sites
 */
export async function listSites() {
  return clientApiFetch("/sites");
}

export async function createSite(data: any) {
  return clientApiFetch("/sites", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function siteQrPngUrl(siteId: string) {
  return `${API_BASE}/sites/${siteId}/qr.png`;
}
