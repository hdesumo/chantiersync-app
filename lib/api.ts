// lib/api.ts
// ✅ Version safe, utilisable côté client et serveur

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

/**
 * Helper générique pour appeler ton backend
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/* === SITES === */
export const listSites = () => apiFetch("/sites");
export const createSite = (data: any) =>
  apiFetch("/sites", { method: "POST", body: JSON.stringify(data) });
export const siteQrPngUrl = (id: string) => `${API_BASE}/sites/${id}/qr.png`;

/* === ENTERPRISES === */
export interface Enterprise {
  id: string;
  name: string;
  slug: string;
}

export const listEnterprises = () => apiFetch<Enterprise[]>("/enterprises");
export const getEnterprise = (id: string) =>
  apiFetch<Enterprise>(`/enterprises/${id}`);
export const deleteEnterprise = (id: string) =>
  apiFetch(`/enterprises/${id}`, { method: "DELETE" });

/* === USERS === */
export const listUsers = () => apiFetch("/users");

/* === REPORTS === */
export const listReports = () => apiFetch("/reports");
