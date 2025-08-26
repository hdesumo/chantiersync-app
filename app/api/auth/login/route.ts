// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const r = await fetch(`${apiBase}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    return NextResponse.json(
      { error: data?.error || "Invalid credentials" },
      { status: r.status }
    );
  }

  // On attend { token, user }
  const token = data?.token as string | undefined;
  if (!token) {
    return NextResponse.json({ error: "Missing token in response" }, { status: 500 });
  }

  setSessionCookie(token);
  return NextResponse.json({ user: data.user });
}
