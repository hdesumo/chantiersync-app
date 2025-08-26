// middleware.ts
import { NextRequest, NextResponse } from "next/server";


const PUBLIC = ["/login", "/favicon.ico", "/_next", "/api", "/assets", "/images"];


export function middleware(req: NextRequest) {
const { pathname } = req.nextUrl;
const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
if (isPublic) return NextResponse.next();


const hasSession = req.cookies.has("cs_session");
if (!hasSession) {
const url = req.nextUrl.clone();
url.pathname = "/login"; url.searchParams.set("next", pathname);
return NextResponse.redirect(url);
}
return NextResponse.next();
}


export const config = {
matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};