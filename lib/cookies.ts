// lib/cookies.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "cs_session";
const ONE_DAY = 60 * 60 * 24; // 24 heures

// On définit maxAge par défaut, donc tu peux appeler setSessionCookie(token) sans 2e param
export function setSessionCookie(token: string, maxAge: number = ONE_DAY) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getSessionToken(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}
