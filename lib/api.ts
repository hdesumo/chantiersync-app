// lib/api.ts
// Client minimal basé sur fetch, avec typage ApiResult<T> et helpers pratiques.

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  status?: number;
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

export type Site = {
  id: string;
  name: string;
  qr_url?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  enterprise_id?: string;
};

const BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  'https://api.chantiersync.com';

// ----- utilitaires -----

function buildURL(path: string, params?: Record<string, any>) {
  const url = new URL(path.startsWith('http') ? path : `${BASE}${path}`);
  if (params) {
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  return url.toString();
}

async function http<T>(
  path: string,
  init?: (RequestInit & { params?: Record<string, any> }) | undefined,
  token?: string
): Promise<ApiResult<T>> {
  try {
    const url = buildURL(path, init?.params);
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { ...init, headers, cache: 'no-store' });
    const status = res.status;

    // Tente de parser du JSON, sinon texte
    let payload: any = undefined;
    const text = await res.text();
    try {
      payload = text ? JSON.parse(text) : undefined;
    } catch {
      payload = text || undefined;
    }

    if (!res.ok) {
      const msg =
        (payload && (payload.error || payload.message)) ||
        `HTTP ${status}`;
      return { ok: false, error: msg, status };
    }

    return { ok: true, data: payload as T, status };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}

// Expose un mini « api » compatible avec un usage axios-like pour .get(url, { params })
const api = {
  get: <T>(path: string, opts?: { params?: Record<string, any>; token?: string }) =>
    http<T>(path, { method: 'GET', params: opts?.params }, opts?.token),
  post: <T>(path: string, body?: any, token?: string) =>
    http<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }, token),
  put:  <T>(path: string, body?: any, token?: string) =>
    http<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }, token),
  del:  <T>(path: string, token?: string) =>
    http<T>(path, { method: 'DELETE' }, token),
};

// ----- endpoints métiers -----

export async function login(email: string, password: string): Promise<ApiResult<AuthLoginResponse>> {
  return api.post<AuthLoginResponse>('/api/auth/login', { email, password });
}

export async function listSites(opts?: {
  token?: string;
  page?: number;
  limit?: number;
  q?: string;
  order?: string;
}): Promise<ApiResult<Site[]>> {
  return api.get<Site[]>('/api/sites', {
    token: opts?.token,
    params: {
      page: opts?.page,
      limit: opts?.limit,
      q: opts?.q,
      order: opts?.order,
    },
  });
}

export async function createSite(
  payload: { name: string },
  token?: string
): Promise<ApiResult<Site>> {
  return api.post<Site>('/api/sites', payload, token);
}

export function siteQrPngUrl(siteId: string) {
  return `${BASE}/api/sites/${siteId}/qr.png`;
}

// (exemples admin)
export async function listUsers(opts?: {
  token?: string;
  page?: number;
  limit?: number;
  q?: string;
}): Promise<ApiResult<User[]>> {
  return api.get<User[]>('/api/users', {
    token: opts?.token,
    params: { page: opts?.page, limit: opts?.limit, q: opts?.q },
  });
}

export default api;
