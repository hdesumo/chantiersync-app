// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // ⚠️ ajoute "jsonwebtoken" à ton projet

// Routes protégées simples
const PROTECTED_PATHS = ["/protected", "/app/protected"];

// Routes par rôle
const ROLE_PATHS: Record<string, string[]> = {
  SUPERADMIN: ["/superadmin", "/protected/superadmin"],
  ADMIN: ["/admin", "/protected/admin"],
  AGENT: ["/agent", "/protected/agent"],
};

// Clé secrète pour décoder le token (même que dans ton backend Laravel/Symfony/Node)
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Vérifie si la route est protégée
  const isProtected =
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) ||
    Object.values(ROLE_PATHS).some((paths) =>
      paths.some((p) => pathname.startsWith(p))
    );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Récupère le token stocké en cookie
  const token = req.cookies.get("session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Décode le token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };

    if (!decoded?.role) {
      throw new Error("Role manquant dans le token");
    }

    const userRole = decoded.role;

    // Vérifie si l’utilisateur a le droit d’accéder à la route
    for (const [role, paths] of Object.entries(ROLE_PATHS)) {
      if (paths.some((p) => pathname.startsWith(p))) {
        if (userRole !== role) {
          const forbiddenUrl = new URL("/403", req.url); // page "Accès interdit"
          return NextResponse.redirect(forbiddenUrl);
        }
      }
    }
  } catch (err) {
    console.error("Erreur middleware:", err);
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Sinon -> accès autorisé
  return NextResponse.next();
}

// Matcher : routes surveillées
export const config = {
  matcher: [
    "/protected/:path*",
    "/app/protected/:path*",
    "/superadmin/:path*",
    "/admin/:path*",
    "/agent/:path*",
  ],
};
