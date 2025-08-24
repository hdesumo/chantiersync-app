// lib/api.ts
// =============================

const BASE =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
    'https://api.chantiersync.com') as string;

type Dict = Record<string, string | number | boolean | undefined>;

function qs(params?: Dict): string {
  if (!params) return '';
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    u.set(k, String(v));
  }
  const s = u.toString();
  return s ? `?${s}` : '';
}

async function doJson<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: 'no-store' });
  const json = (await res
    .json()
    .catch(() => ({}))) as any;

  if (!res.ok) {
    const msg = json?.error || json?.message || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return json as T;
}

// ---------------- Types partagés ----------------
export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type AuthLoginResponse = {
  token: string;
  user?: {
    id: string;
    name?: string;
    role?: string;
    enterprise?: string;
  };
};

// (Facultatif) quelques types APi
export type Site = {
  id: string;
  name: string;
  enterprise_id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt?: string;
};

// ---------------- Client minimal (axios-like) ----------------
type GetOptions = {
  params?: Dict;
  token?: string;
  headers?: Record<string, string>;
};

type PostOptions = {
  token?: string;
  headers?: Record<string, string>;
};

const api = {
  async get<T = any>(path: string, opts: GetOptions = {}): Promise<{ data: T }> {
    const url = `${BASE}${path}${qs(opts.params)}`;
    const headers: Record<string, string> = { ...(opts.headers || {}) };
    if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

    const data = await doJson<T>(url, { method: 'GET', headers });
    return { data };
  },

  async post<T = any>(
    path: string,
    body?: any,
    opts: PostOptions = {}
  ): Promise<{ data: T }> {
    const url = `${BASE}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    };
    if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

    const data = await doJson<T>(url, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  },
};

export default api;

// ---------------- Endpoints helpers ----------------

// Auth
export async function login(
  email: string,
  password: string
): Promise<ApiResult<AuthLoginResponse>> {
  try {
    const { data } = await api.post<AuthLoginResponse>('/api/auth/login', {
      email,
      password,
    });
    if (data?.token) {
      return { ok: true, data };
    }
    return { ok: false, error: 'Réponse invalide du serveur' };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erreur réseau' };
  }
}

// Users (utilisé par /app/users/page.tsx)
export async function listUsers(params: {
  token?: string;
  page?: number;
  limit?: number;
  q?: string;
}) {
  const { token, ...query } = params || {};
  return api.get<User[]>('/api/users', { token, params: query });
}

// Sites (utilisé par /app/sites/page.tsx)
export async function listSites(params: {
  token?: string;
  page?: number;
  pageSize?: number;
  q?: string;
  order?: string;
}): Promise<{ data: Site[] }> {
  const { token, ...query } = params || {};
  return api.get<Site[]>('/api/sites', { token, params: query });
}

export async function createSite(
  payload: { name: string },
  token: string
): Promise<ApiResult<Site>> {
  try {
    const { data } = await api.post<Site>('/api/sites', payload, { token });
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erreur création' };
  }
}

// QR code PNG d’un site (URL directe, pratique pour <img/>)
export function siteQrPngUrl(siteId: string, token?: string) {
  const u = new URL(`${BASE}/api/sites/${siteId}/qr.png`);
  if (token) u.searchParams.set('token', token);
  return u.toString();
}
