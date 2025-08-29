// lib/api.ts
import { User, Enterprise, License, Site, Report, Tenant } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.chantiersync.com/api";

// --- Utilitaires génériques fetch ---
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// --- AUTH ---
export async function login(email: string, password: string) {
  return apiFetch<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
}

// --- USERS ---
export async function listUsers(): Promise<User[]> {
  return apiFetch("/users");
}

// --- ENTERPRISES ---
export async function listEnterprises(): Promise<Enterprise[]> {
  return apiFetch("/enterprises");
}

export async function getEnterprise(id: string): Promise<Enterprise> {
  return apiFetch(`/enterprises/${id}`);
}

export async function createEnterprise(
  payload: Partial<Enterprise>
): Promise<Enterprise> {
  return apiFetch("/enterprises", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEnterprise(
  id: string,
  payload: Partial<Enterprise>
): Promise<Enterprise> {
  return apiFetch(`/enterprises/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEnterprise(id: string) {
  return apiFetch
