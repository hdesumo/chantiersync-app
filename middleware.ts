// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  /^\/login(?:\/)?$/,
  /^\/_next\/.*/i,
  /^\/favicon\.ico$/i,
  /^\/robots\.txt$/i,
  /^\/sitemap\.xml$/i,
  /^\/images\/.*/i,
  /^\/icons\/.*/i,
  /^\/assets\/.*/i,
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((re) => re.test(pathname));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('cs_token')?.value || '';

  // si déjà connecté et sur /login → redirige vers /sites
  if (pathname.startsWith('/login')) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = '/sites';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ressources publiques : laissons passer
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // sinon, pages protégées → exiger le token
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // exclut tous les fichiers statiques /api (si tu as des API routes locales)
  matcher: ['/((?!_next/|.*\\..*|api/).*)'],
};
