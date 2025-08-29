// lib/api.ts
import axios from "axios";

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
});

// === Exports spécifiques pour les modules ===

// Sites
export async function listSites() {
  const res = await clientApi.get("/sites");
  return res.data;
}

export async function createSite(payload: any) {
  const res = await clientApi.post("/sites", payload);
  return res.data;
}

export function siteQrPngUrl(siteId: string) {
  return `${clientApi.defaults.baseURL}/sites/${siteId}/qr.png`;
}

// Exemple : autres modules (Tenants, Reports, Users) → à compléter
export async function listTenants() {
  const res = await clientApi.get("/tenants");
  return res.data;
}

export async function listReports() {
  const res = await clientApi.get("/reports");
  return res.data;
}

// === Export par défaut du client ===
export default clientApi;
