// lib/api.ts

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ---- interface "axios-like" ----
export type ApiResult<T> = { data: T };

export async function get<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const data = await apiFetch<T>(path, { method: 'GET', ...(init || {}) });
  return { data };
}

export async function post<T>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const data = await apiFetch<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...(init || {}),
  });
  return { data };
}

// cas spécifique: login
export function authLogin(email: string, password: string) {
  return post<{ token: string; user: any }>('/api/auth/login', { email, password });
}

// export "default" attendu dans tes imports
const api = { API_URL, get, post, authLogin };
export default api;
