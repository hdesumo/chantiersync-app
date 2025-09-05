// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken"; // ✅ compatible Vercel / Next.js 14

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret";

/**
 * Routes protégées → redirection login si pas de token
 */
const PROTECTED_PATHS = ["/dashboard", "/tenant", "/superadmin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Vérifie si la route demandée est protégée
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // Vérification du token avec la clé secrète
      jwt.verify(token, SESSION_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error("❌ Token invalide :", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tenant/:path*", "/superadmin/:path*"],
};
