// lib/api.ts
// =============================

export type ApiResult<T> = { ok: boolean; data?: T; error?: string };

// Base URL (ex: https://api.chantiersync.com)
const BASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  (typeof window !== 'undefined' && (window as any).__API_URL__) ||
  '';

function withAuth(headers: HeadersInit = {}, token?: string) {
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...headers as any };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function request<T>(
  path: string,
  opts: RequestInit & { token?: string } = {}
): Promise<ApiResult<T>> {
  const { token, ...init } = opts;
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: withAuth(init.headers || {}, token),
      // important pour Next en SSR : évite la mise en cache non voulue
      cache: 'no-store',
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await res.json() : (await res.text());

    if (!res.ok) {
      const msg = isJson ? body?.error || JSON.stringify(body) : (body as string);
      return { ok: false, error: msg || `HTTP ${res.status}` };
    }
    return { ok: true, data: body as T };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}

/* ========== AUTH ========== */

export type AuthLoginResponse = { token: string; user?: any };

export async function login(
  email: string,
  password: string
): Promise<ApiResult<AuthLoginResponse>> {
  return request<AuthLoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/* ========== USERS ========== */

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export async function listUsers(params: {
  token: string;
  page?: number;
  limit?: number;
  q?: string;
}): Promise<ApiResult<User[]>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.q) qs.set('q', params.q);

  const url = `/api/users${qs.toString() ? `?${qs.toString()}` : ''}`;
  return request<User[]>(url, { token: params.token });
}

/* ========== SITES ========== */

export type Site = { id: string; name: string; createdAt?: string };

export async function listSites(token: string): Promise<ApiResult<Site[]>> {
  return request<Site[]>('/api/sites', { token });
}

export async function createSite(
  input: { name: string },
  token: string
): Promise<ApiResult<Site>> {
  return request<Site>('/api/sites', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}

export function siteQrPngUrl(siteId: string): string {
  // endpoint d’exemple (adapte si ton API diffère)
  return `${BASE_URL}/api/sites/${siteId}/qr.png`;
}
