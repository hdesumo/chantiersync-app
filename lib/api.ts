// lib/api.ts

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.chantiersync.com';

/** Appel générique JSON */
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

/** Interface "axios-like" */
export type ApiResult<T> = { data: T };

/** Helpers HTTP */
export async function get<T = any>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
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

export async function patch<T = any>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const data = await apiFetch<T>(path, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
    ...(init || {}),
  });
  return { data };
}

export async function del<T = any>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const data = await apiFetch<T>(path, { method: 'DELETE', ...(init || {}) });
  return { data };
}

/** ==== Endpoints métier ==== */

/** Auth */
export type AuthLoginResponse = { token: string; user: any };
export async function login(email: string, password: string) {
  return post<AuthLoginResponse>('/api/auth/login', { email, password });
}

/** Sites (console client) */
export type Site = {
  id: string;
  name: string;
  address?: string | null;
  enterprise_id?: string | null;
  createdAt?: string;
};

export type ListSitesParams = {
  token?: string;
  page?: number;
  pageSize?: number;
  q?: string;
  order?: string;
};

/** listSites : supporte token (string) ou objet { token, page, ... } */
export async function listSites(arg?: string | ListSitesParams) {
  const params: ListSitesParams =
    typeof arg === 'string' ? { token: arg } : { ...(arg || {}) };

  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  if (params.q) qs.set('q', params.q);
  if (params.order) qs.set('order', params.order);

  const path = qs.toString() ? `/api/sites?${qs.toString()}` : '/api/sites';
  const headers = params.token ? { Authorization: `Bearer ${params.token}` } : undefined;

  return get<Site[]>(path, { headers });
}

export async function createSite(
  input: Partial<Pick<Site, 'name' | 'address'>>,
  token?: string
) {
  return post<Site>('/api/sites', input, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** Utilitaires */
export function siteQrPngUrl(siteId: string) {
  return `${API_URL}/api/sites/${siteId}/qr.png`;
}

/** Export par défaut (utilisé comme `api`) */
const api = {
  API_URL,
  get,
  post,
  patch,
  del,
  login,
  listSites,
  createSite,
  siteQrPngUrl,
};

export default api;
