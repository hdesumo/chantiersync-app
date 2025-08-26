// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL!;
const COOKIE_NAME = "cs_session";

type Params = { path?: string[] };

async function handler(req: NextRequest, { params }: { params: Params }) {
  if (!API_BASE) {
    return NextResponse.json({ error: "API_BASE_URL not configured" }, { status: 500 });
  }

  const segments = params.path ?? [];
  const path = segments.join("/");
  // (Optionnel) Sécurité basique: limiter au préfixe 'api/'
  // if (!path.startsWith("api/")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const search = req.nextUrl.search ?? "";
  const url = `${API_BASE}/${path}${search}`;

  // Copie des headers en évitant ceux à risque
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("accept-encoding");
  headers.delete("cookie"); // ne jamais forward les cookies Next

  // Injecte le Bearer depuis le cookie httpOnly
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const init: RequestInit = {
    method: req.method,
    headers,
    // On passe le flux directement (OK pour JSON, fichiers, etc.)
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    redirect: "manual",
    cache: "no-store",
  };

  const upstream = await fetch(url, init);

  // Re-transmet la réponse (stream)
  const respHeaders = new Headers(upstream.headers);
  // Normalisation CORS si besoin (pas nécessaire en même-origine, mais inoffensif)
  respHeaders.set("access-control-allow-origin", "*");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
