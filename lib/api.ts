// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/* ========================== AUTH ========================== */

export async function registerTenant(data: {
  companyName: string;
  contactName: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/register-tenant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de l'inscription");
  return res.json();
}

export async function loginUser(credentials: {
  email?: string;
  password?: string;
  full_mobile?: string;
  pin?: string;
}) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Identifiants incorrects");
  return res.json();
}

export function logoutUser() {
  document.cookie = "token=; path=/; max-age=0;";
}

export async function verifyToken(token: string) {
  const res = await fetch(`${API_URL}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Token invalide ou expiré");
  return res.json();
}

/* ========================== SITES ========================== */

export async function getSites(token?: string) {
  const res = await fetch(`${API_URL}/sites`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des sites");
  return res.json();
}

export async function getSite(id: string, token?: string) {
  const res = await fetch(`${API_URL}/sites/${id}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Erreur lors du chargement du site");
  return res.json();
}

export async function createSite(data: any, token: string) {
  const res = await fetch(`${API_URL}/sites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création du site");
  return res.json();
}

/* ========================== UTILITAIRE ========================== */

/**
 * Retourne l'URL du QR code PNG pour un site
 */
export function siteQrPngUrl(siteId: string): string {
  return `${API_URL}/sites/${siteId}/qr.png`;
}
