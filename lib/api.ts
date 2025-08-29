// lib/api.ts
import { getSessionToken } from "@/lib/cookiesserver"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.chantiersync.com"

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

// --- Version server-side (utilise cookie de session) ---
export async function serverApiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getSessionToken()

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

// --- Exemple d’endpoints spécifiques ---
export async function listSites() {
  return apiFetch("/sites", { method: "GET" })
}

export async function createSite(data: any) {
  return apiFetch("/sites", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function siteQrPngUrl(siteId: string) {
  return `${API_BASE_URL}/sites/${siteId}/qr.png`
}

export async function deleteEnterprise(id: string) {
  return apiFetch(`/enterprises/${id}`, { method: "DELETE" })
}

// ✅ Export par défaut pour compatibilité avec les imports existants
const api = {
  apiFetch,
  serverApiFetch,
  listSites,
  createSite,
  siteQrPngUrl,
  deleteEnterprise,
}

export default api
