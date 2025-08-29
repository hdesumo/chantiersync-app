// lib/cookiesserver.ts
import { cookies } from "next/headers"

const COOKIE_NAME = "cs_session"
const ONE_DAY = 60 * 60 * 24

export async function getSessionToken(): Promise<string | null> {
  return cookies().get(COOKIE_NAME)?.value || null
}

export function setSessionToken(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: ONE_DAY,
  })
}

export function clearSessionToken() {
  cookies().delete(COOKIE_NAME)
}
