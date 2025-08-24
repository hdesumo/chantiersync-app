// lib/api.ts

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Appel générique JSON
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// Helpers pratiques
export function get<T>(path: string, init?: RequestInit) {
  return apiFetch<T>(path, { method: "GET", ...(init || {}) });
}

export function post<T>(path: string, body?: any, init?: RequestInit) {
  return apiFetch<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    ...(init || {}),
  });
}

// Exemple spécifique: login
export function authLogin(email: string, password: string) {
  return post<{ token: string; user: any }>("/api/auth/login", {
    email,
    password,
  });
}

// ⚠️ Export par défaut attendu par `import api from "@/lib/api"`
const api = {
  API_URL,
  fetch: apiFetch,
  get,
  post,
  authLogin,
};

export default api;
