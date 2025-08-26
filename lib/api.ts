// lib/api.ts

// ---------- CLIENT HELPERS (pour "use client") ----------
export async function clientGet<T>(path: string) {
  // path ex: "api/enterprises?limit=20"
  const r = await fetch(`/api/proxy/${path}`, { cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}

export async function clientPost<T>(path: string, body: unknown) {
  const r = await fetch(`/api/proxy/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}

export async function clientDelete<T>(path: string) {
  const r = await fetch(`/api/proxy/${path}`, { method: "DELETE" });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}

// Upload multipart (fichier/logo)
export async function clientUpload<T>(path: string, form: FormData) {
  const r = await fetch(`/api/proxy/${path}`, { method: "POST", body: form });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}

// ---------- SERVER HELPER (pour Server Components) ----------
export async function serverApiFetch<T>(path: string, init: RequestInit = {}) {
  // path ex: "/api/enterprises?limit=20" (chemin backend)
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  // On lit le token httpOnly via cookies (Next server)
  let token: string | null = null;

  try {
    // 1) Si tu as déjà lib/cookies.ts avec getSessionToken(), on l’utilise
    const mod = await import("@/lib/cookies");
    if (typeof mod.getSessionToken === "function") {
      token = mod.getSessionToken();
    }
  } catch {
    // 2) Fallback safe si pas de module cookies dispo
    try {
      const { cookies } = await import("next/headers");
      token = cookies().get("cs_session")?.value ?? null;
    } catch {
      token = null;
    }
  }

  if (token) headers.set("Authorization", `Bearer ${token}`);

  const r = await fetch(`${base}${path}`, { ...init, headers, cache: "no-store" });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}

// ---------- Types utiles (facultatif) ----------
export type Enterprise = {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  logo_url?: string | null;
  leaders?: string[];
};
