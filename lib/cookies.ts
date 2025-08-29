// lib/cookies.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "cs_session";
const ONE_DAY = 60 * 60 * 24;

// Récupération du token de session côté serveur
export function getSessionToken() {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

// Définir le cookie de session (après login)
export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY,
  });
  return response;
}

// Effacer le cookie de session (après logout)
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
