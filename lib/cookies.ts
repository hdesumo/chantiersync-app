// lib/cookies.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "cs_session";
const ONE_DAY = 60 * 60 * 24;

/**
 * Récupère le token de session depuis les cookies
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value || null;
}

/**
 * Définit un cookie de session (HttpOnly)
 */
export function setSessionCookie(token: string, maxAge: number = ONE_DAY) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge,
  });
}

/**
 * Supprime le cookie de session
 */
export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}
