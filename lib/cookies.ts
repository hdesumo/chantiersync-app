// lib/cookies.ts
import { cookies } from "next/headers";

const COOKIE_NAME = "cs_session";

// Récupération du token de session côté serveur
export function getSessionToken() {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}
