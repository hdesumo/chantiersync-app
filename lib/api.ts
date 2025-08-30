// lib/api.ts

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    cache: "no-store", // important pour SSR
  });

  if (!res.ok) {
    throw new Error(`Erreur API serveur: ${res.status}`);
  }

  return res.json();
}
