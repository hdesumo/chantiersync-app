// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/cookies.server";

export async function POST() {
  try {
    // ✅ Supprimer le cookie
    clearSessionCookie();

    return NextResponse.json({ message: "Déconnexion réussie" });
  } catch (err: any) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: "Erreur interne serveur" },
      { status: 500 }
    );
  }
}
