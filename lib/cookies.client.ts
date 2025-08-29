// lib/cookies.client.ts
"use client";

// Exemple d'accès client aux cookies si nécessaire
export function getClientSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )cs_session=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}
