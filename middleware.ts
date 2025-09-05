// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret";
const encoder = new TextEncoder();

/**
 * Routes protégées → redirection login si pas de token
 */
const PROTECTED_PATHS = ["/dashboard", "/tenant", "/superadmin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(token, encoder.encode(SESSION_SECRET));
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
