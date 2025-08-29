// lib/api.ts
import { getSessionToken } from "@/lib/cookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// -------------------
// Types
// -------------------
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface Enterprise {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  address?: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  siteId: string;
}

// -------------------
// Helpers
// -------------------
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// Version serveur (inclut cookie session)
export async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getSessionToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Server API error ${res.status}`);
  return res.json();
}

// -------------------
// Sites
// -------------------
export async function listSites(): Promise<Site[]> {
  return apiFetch("/sites");
}

export async function createSite(data: Partial<Site>): Promise<Site> {
  return apiFetch("/sites", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function siteQrPngUrl(siteId: string): string {
  return `${API_URL}/sites/${siteId}/qr.png`;
}

// -------------------
// Enterprises
// -------------------
export async function listEnterprises(): Promise<Enterprise[]> {
  return apiFetch("/enterprises");
}

export async function createEnterprise(
  data: Partial<Enterprise>
): Promise<Enterprise> {
  return apiFetch("/enterprises", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEnterprise(
  id: string,
  data: Partial<Enterprise>
): Promise<Enterprise> {
  return apiFetch(`/enterprises/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEnterprise(id: string): Promise<{ message: string }> {
  return apiFetch(`/enterprises/${id}`, {
    method: "DELETE",
  });
}

// -------------------
// Users
// -------------------
export async function listUsers(): Promise<User[]> {
  return apiFetch("/users");
}

// -------------------
// Reports
// -------------------
export async function listReports(): Promise<Report[]> {
  return apiFetch("/reports");
}

// -------------------
// Licenses (si utilisé)
// -------------------
export async function listLicenses(): Promise<any[]> {
  return apiFetch("/licenses");
}
