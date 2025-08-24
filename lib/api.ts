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

export type ApiResult<T> = { data: T };

export async function get<T = any>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const data = await apiFetch<T>(path, { method: 'GET', ...(init || {}) });
  return { data };
}

export async function post<T = any>(
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

export type AuthLoginResponse = { token: string; user: any };
export function authLogin(email: string, password: string) {
  return post<AuthLoginResponse>('/api/auth/login', { email, password });
}

const api = { API_URL, get, post, authLogin };
export default api;
