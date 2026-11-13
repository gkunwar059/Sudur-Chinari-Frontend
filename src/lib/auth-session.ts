import { cache } from "react";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";
import type { User } from "@/context/AuthContext";

const rawBackend = process.env.DJANGO_API_URL || "http://127.0.0.1:8001";
const BACKEND_URL = rawBackend.replace(/\/+$/, "").replace(/\/api\/v1$/, "");

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const REFRESH_LEEWAY_SECONDS = 30;

const accessCookieOptions = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24, // 1 day
};

const refreshCookieOptions = {
  ...accessCookieOptions,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export function isAccessTokenExpiring(token: string): boolean {
  try {
    const segment = token.split(".")[1];
    if (!segment) return true;
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    if (typeof payload.exp !== "number") return true;
    return payload.exp * 1000 < Date.now() + REFRESH_LEEWAY_SECONDS * 1000;
  } catch {
    return true;
  }
}

async function fetchMe(token: string): Promise<User> {
  return apiFetch<User>("/auth/users/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function refreshTokens(
  refreshToken: string,
): Promise<{ access?: string; refresh?: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Returns a valid access token from cookies, refreshing via refresh_token
 * if the current access_token is missing or expired. When called from a
 * Server Action or Route Handler, persists the refreshed cookies.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (accessToken && !isAccessTokenExpiring(accessToken)) {
    return accessToken;
  }

  if (refreshToken) {
    const refreshed = await refreshTokens(refreshToken);
    if (refreshed?.access) {
      try {
        cookieStore.set(ACCESS_COOKIE, refreshed.access, accessCookieOptions);
        if (refreshed.refresh) {
          cookieStore.set(
            REFRESH_COOKIE,
            refreshed.refresh,
            refreshCookieOptions,
          );
        }
      } catch {
        // cookies().set() is only mutable in Server Actions / Route Handlers
      }
      return refreshed.access;
    }
  }

  return null;
}

/**
 * Resolves the session user from HttpOnly cookies on the server.
 * Runs inside a Suspense boundary so pages stay instant.
 */
export const getSessionUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (accessToken && !isAccessTokenExpiring(accessToken)) {
    try {
      return await fetchMe(accessToken);
    } catch {
      // expired or invalid access token — try refresh below
    }
  }

  if (refreshToken) {
    const refreshed = await refreshTokens(refreshToken);
    if (refreshed?.access) {
      try {
        return await fetchMe(refreshed.access);
      } catch {
        // refresh token valid but user fetch failed
      }
    }
  }

  return null;
});
