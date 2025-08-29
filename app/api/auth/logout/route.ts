// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/cookies.server.server";

export async function POST() {
  // On supprime le cookie de session
  clearSessionCookie();

  return NextResponse.json({ success: true });
}
