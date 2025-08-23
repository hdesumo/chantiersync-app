// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Routes protégées par login
const PROTECTED = [/^\/sites(?:\/.*)?$/, /^\/reports(?:\/.*)?$/];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('cs_token')?.value || '';

  const isProtected = PROTECTED.some((re) => re.test(pathname));
  const isLogin = pathname === '/login';

  // Si route protégée et pas de token -> redirige vers /login?next=<path>
  if (isProtected && !token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname + (search || ''));
    return NextResponse.redirect(url);
  }

  // Si déjà loggé et on va sur /login -> envoie vers /sites
  if (isLogin && token) {
    const url = new URL('/sites', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Ignore les assets statiques pour éviter du travail inutile
export const config = {
  matcher: [
    // tout sauf assets statiques et fichiers communs
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)).*)',
  ],
};
