// lib/api.server.ts
import { cookies } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const token = cookies().get("cs_session")?.value;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error(`Server fetch failed: ${path}`);
  return res.json();
}
