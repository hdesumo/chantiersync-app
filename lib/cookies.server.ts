// lib/cookies.server.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "cs_session";
const ONE_DAY = 60 * 60 * 24;

/**
 * Enregistre le token dans un cookie httpOnly
 */
export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: ONE_DAY,
  });
}

/**
 * Supprime le cookie de session
 */
export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

/**
 * Récupère le token
 */
export function getSessionToken(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}
