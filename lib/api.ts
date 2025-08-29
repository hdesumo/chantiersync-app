// lib/api.ts
import axios from "axios";

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
});

export default clientApi;

// ---- SERVER-SIDE FETCH ----
export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Erreur API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
