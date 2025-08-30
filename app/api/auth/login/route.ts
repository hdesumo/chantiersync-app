// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/cookies.server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Échec de la connexion" },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.token) {
      return NextResponse.json(
        { error: "Token non fourni par l'API" },
        { status: 500 }
      );
    }

    // ✅ Stocker le token dans un cookie sécurisé
    setSessionCookie(data.token);

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Erreur interne serveur" },
      { status: 500 }
    );
  }
}
