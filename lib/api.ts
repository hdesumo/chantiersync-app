// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Récupérer la liste des sites
 */
export async function getSites() {
  const res = await fetch(`${API_URL}/sites`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur lors du chargement des sites");
  return res.json();
}

/**
 * Récupérer un site par son ID
 */
export async function getSite(id: string) {
  const res = await fetch(`${API_URL}/sites/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur lors du chargement du site");
  return res.json();
}

/**
 * Créer un site
 */
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

/**
 * URL du QR code PNG d’un site
 */
export function siteQrPngUrl(siteId: string): string {
  return `${API_URL}/sites/${siteId}/qr.png`;
}
