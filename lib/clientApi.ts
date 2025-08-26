// lib/clientApi.ts
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

export async function clientUpload<T>(path: string, form: FormData) {
  const r = await fetch(`/api/proxy/${path}`, { method: "POST", body: form });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as T;
}
