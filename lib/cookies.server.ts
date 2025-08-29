// lib/cookies.server.ts
"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "cs_session";
const ONE_DAY = 60 * 60 * 24;

// Lire le token côté serveur
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

// Définir un cookie côté serveur
export async function setSessionCookie(token: string, days = 1) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: ONE_DAY * days,
    sameSite: "lax",
  });
}

// Effacer un cookie côté serveur
export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}
