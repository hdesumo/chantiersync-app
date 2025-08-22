// lib/api.ts
const API = process.env.NEXT_PUBLIC_API_BASE!;
if (!API) {
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_API_BASE manquant dans .env');
}

type FetchOpts = {
  method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
  token?: string | null;
  body?: unknown;
  headers?: Record<string,string>;
};

async function request<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { method = 'GET', token, body, headers = {} } = opts;
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status} ${res.statusText} – ${msg}`);
  }
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

/* ===== Types ===== */
export type Site = {
  id: string;
  code: string | null;
  name: string;
  location?: string | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ListSitesParams = {
  q?: string;
  status?: 'active'|'archived'|''|null;
  from?: string; // ISO date (YYYY-MM-DD)
  to?: string;   // ISO date (YYYY-MM-DD)
  sortBy?: 'name'|'code'|'createdAt'|'updatedAt'|'status';
  sortDir?: 'asc'|'desc';
  limit?: number;
  offset?: number;
};

/* ===== Endpoints ===== */

// Auth
export async function login(email: string, password: string): Promise<{ token: string; user?: any }> {
  return request('/api/auth/login', { method: 'POST', body: { email, password } });
}

// Sites
export async function listSites(
  token: string,
  params: ListSitesParams = {}
): Promise<{ count: number; rows: Site[]; limit: number; offset: number }> {
  const {
    q, status, from, to, sortBy, sortDir,
    limit = 10, offset = 0,
  } = params;

  const qs = new URLSearchParams();
  if (q) qs.set('q', q);
  if (status) qs.set('status', status);
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  if (sortBy) qs.set('sortBy', sortBy);
  if (sortDir) qs.set('sortDir', sortDir);
  qs.set('limit', String(limit));
  qs.set('offset', String(offset));

  return request(`/api/sites?${qs.toString()}`, { token });
}

export async function createSite(token: string, data: { name: string; code?: string; location?: string }) {
  return request('/api/sites', { method: 'POST', token, body: data });
}

export function siteQrPngUrl(siteId: string, size = 256) {
  const u = new URL(`${API}/api/sites/${siteId}/qr.png`);
  u.searchParams.set('size', String(size));
  return u.toString();
}
