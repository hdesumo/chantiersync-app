// lib/auth.ts
import { setSessionCookie, clearSessionCookie } from "@/lib/cookies.server";

export function login(token: string) {
  setSessionCookie(token);
}

export function logout() {
  clearSessionCookie();
}
