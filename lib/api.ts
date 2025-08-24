// Client HTTP minimal basé sur fetch, avec types et helpers.
// Utilise NEXT_PUBLIC_API_URL pour pointer vers l’API déployée.

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

const BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  'http://localhost:5000';

function headers(token?: string): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function handle<T>(res: Response): Promise<ApiResult<T>> {
  let body: any = null;
  try {
    // tente JSON, sinon texte
    const txt = await res.text();
    body = txt ? JSON.parse(txt) : null;
  } catch {
    body = null;
  }
  if (!res.ok) {
    const error = (body && (body.error || body.message)) || `HTTP ${res.status}`;
    return { ok: false, error };
  }
  return { ok: true, data: body as T };
}

// --------- Auth
export type AuthLoginResponse = {
  token: string;
  user?: { id: string; name?: string; role?: string; enterprise?: string };
};

export async function login(
  email: string,
  password: string
): Promise<ApiResult<AuthLoginResponse>> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  return handle<AuthLoginResponse>(res);
}

// --------- Sites
export type Site = {
  id: string;
  name: string;
  enterprise_id?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ListSitesParams = {
  token?: string;
  page?: number;
  pageSize?: number;
  q?: string;
  order?: string;
};

export async function listSites(
  params: ListSitesParams
): Promise<ApiResult<Site[]>> {
  const { token, page, pageSize, q, order } = params;
  const usp = new URLSearchParams();
  if (page) usp.set('page', String(page));
  if (pageSize) usp.set('pageSize', String(pageSize));
  if (q) usp.set('q', q);
  if (order) usp.set('order', order);

  const res = await fetch(`${BASE}/api/sites?${usp.toString()}`, {
    method: 'GET',
    headers: headers(token),
    cache: 'no-store',
  });
  return handle<Site[]>(res);
}

export async function createSite(
  payload: { name: string },
  token?: string
): Promise<ApiResult<Site>> {
  const res = await fetch(`${BASE}/api/sites`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  return handle<Site>(res);
}

export function siteQrPngUrl(siteId: string, token?: string) {
  const url = new URL(`/api/sites/${siteId}/qr.png`, BASE);
  if (token) url.searchParams.set('token', token);
  return url.toString();
}
