// lib/api.ts
import { getSessionToken } from "@/lib/cookies.server";

// Détecte la bonne base URL selon l'environnement
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.chantiersync.com" // à remplacer si ton backend est ailleurs
    : "http://localhost:8080/api");

// -------------------
//  FETCH CLIENT-SIDE
// -------------------
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

// -------------------
//  FETCH SERVER-SIDE
// -------------------
export async function serverApiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getSessionToken();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
    cache: "no-store", // pour éviter les données obsolètes
  });

  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

// -------------------
//  SITES
// -------------------
export async function listSites() {
  return apiFetch("/sites");
}

export async function createSite(payload: any) {
  return apiFetch("/sites", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function siteQrPngUrl(siteId: string) {
  return `${API_BASE_URL}/sites/${siteId}/qr.png`;
}

// -------------------
//  ENTERPRISES
// -------------------
export async function deleteEnterprise(id: string) {
  return apiFetch(`/enterprises/${id}`, { method: "DELETE" });
}
