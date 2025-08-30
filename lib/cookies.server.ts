// lib/cookies.server.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "cs_session";
const ONE_DAY = 60 * 60 * 24;

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getSessionToken(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}
