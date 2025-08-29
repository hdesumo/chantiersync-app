// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/cookies.server.server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Invalid credentials" },
      { status: res.status }
    );
  }

  const token = data.token;
  if (!token) {
    return NextResponse.json(
      { error: "No token received" },
      { status: 500 }
    );
  }

  // Ici on peut appeler juste avec le token (maxAge est par défaut à 1 jour)
  setSessionCookie(token);

  return NextResponse.json({ user: data.user });
}
