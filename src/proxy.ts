import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ne'] as const;
const DEFAULT_LOCALE = 'en';

const BACKEND_URL = process.env.DJANGO_API_URL || 'http://127.0.0.1:8001';
const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';
// Refresh when the access token has less than this many seconds left, so a
// request never starts with a token that dies mid-flight.
const REFRESH_LEEWAY_SECONDS = 30;

const accessCookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24, // 1 day
};
const refreshCookieOptions = {
  ...accessCookieOptions,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// ─── Locale routing rules ──────────────────────────────────────────────────
// Rule 1: /en  or /en/* → 308 redirect to unprefixed path (never serve /en/)
// Rule 2: /ne or /ne/* → pass through to app/[lang]/
// Rule 3: Any other path → internally rewrite to /en<path> (URL unchanged)
//
// Language is decided by URL ONLY. No Accept-Language, cookie, or IP detection.
// This ensures crawlers get stable, canonical URLs and SSG/ISR works correctly.

// ─── API proxy rules ───────────────────────────────────────────────────────
// Requests to /api/v1/* are proxied to Django, with HttpOnly access_token
// injected as Authorization: Bearer <token>.
//
// Token refresh: if the access token is missing/expired (or about to expire)
// and a refresh_token cookie exists, the middleware transparently exchanges
// it at /auth/jwt/refresh/, attaches the new access token to the request, and
// sets the refreshed cookies on the response. Failed refreshes clear both
// cookies so the browser falls back to a logged-out state.

function isAccessTokenExpiring(token: string): boolean {
  try {
    const segment = token.split('.')[1];
    if (!segment) return true;
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    if (typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 < Date.now() + REFRESH_LEEWAY_SECONDS * 1000;
  } catch {
    return true;
  }
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<{ access?: string; refresh?: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/jwt/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. API and Media proxy ───────────────────────────────────────────────
  if (pathname === '/api/v1' || pathname.startsWith('/api/v1/')) {
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

    // Fast path: access token present and not about to expire.
    if (accessToken && !isAccessTokenExpiring(accessToken)) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // Try to refresh before giving up on the (expired) access token.
    if (refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);

      if (refreshed?.access) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('Authorization', `Bearer ${refreshed.access}`);
        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });
        response.cookies.set(ACCESS_COOKIE, refreshed.access, accessCookieOptions);
        // Only re-set the refresh cookie when the backend rotates it.
        if (refreshed.refresh) {
          response.cookies.set(REFRESH_COOKIE, refreshed.refresh, refreshCookieOptions);
        }
        return response;
      }

      // Refresh rejected (expired/revoked): clear the dead session.
      const response = NextResponse.next();
      response.cookies.delete(ACCESS_COOKIE);
      response.cookies.delete(REFRESH_COOKIE);
      return response;
    }

    // No refresh token: forward whatever access token exists (if any).
    const requestHeaders = new Headers(request.headers);
    if (accessToken) {
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (pathname.startsWith('/media/')) {
    const token = request.cookies.get(ACCESS_COOKIE)?.value;
    if (token) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${token}`);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
    return NextResponse.next();
  }

  // ── 2. Locale routing ─────────────────────────────────────────────────────

  // Rule 1: Redirect /en and /en/* → strip /en prefix (308 = permanent redirect)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newPath = pathname === '/en' ? '/' : pathname.slice(3); // remove '/en'
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url, { status: 308 });
  }

  // Rule 2: /ne or /ne/* — pass through, Next.js router handles [lang]
  if (pathname === '/ne' || pathname.startsWith('/ne/')) {
    return NextResponse.next();
  }

  // Rule 3: All other paths — rewrite to /en<path> internally (browser URL unchanged)
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, news-sitemap.xml, robots.txt, manifest.webmanifest
     * - files with extensions (images, fonts, etc.)
     * - api routes that are NOT /api/v1/* (Next.js internal APIs)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|news-sitemap\\.xml|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|icon\\.|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|mp4|webm)$).*)',
  ],
};
