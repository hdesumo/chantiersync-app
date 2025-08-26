// lib/cookies.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "cs_session"; // httpOnly cookie storing backend token
const ONE_DAY = 60 * 60 * 24;

export function setSessionCookie(token: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY, // ajuste selon besoin
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionToken(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}
