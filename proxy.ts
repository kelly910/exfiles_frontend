import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup'];

export function proxy(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value || null;
  const pathname = req.nextUrl.pathname;

  // Redirect logged-in users away from login/signup
  if (token && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/ai-chats', req.url));
  }

  // Redirect unauthorized users away from private pages
  if (!token && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Prevent caching of authentication state
  const response = NextResponse.next();
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  );

  return response;
}

export const config = {
  matcher: [
    '/ai-chats/:path*',
    '/login',
    '/documents/:path*',
    '/log-incident',
    '/download-doc-report',
    '/plans',
    '/payment-successful',
    '/payment-pending',
    '/payment-failed',
    '/upload-doc',
  ], // Define which routes should trigger the proxy
};
