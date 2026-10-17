import { cache } from "react";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";
import type { User } from "@/context/AuthContext";

const BACKEND_URL = process.env.DJANGO_API_URL || "http://127.0.0.1:8001";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

async function fetchMe(token: string): Promise<User> {
  return apiFetch<User>("/auth/users/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access || null;
  } catch {
    return null;
  }
}

/**
 * Resolves the session user from HttpOnly cookies on the server.
 * Runs inside the header's Suspense boundary so pages stay instant.
 */
export const getSessionUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (accessToken) {
    try {
      return await fetchMe(accessToken);
    } catch {
      // expired or invalid access token — try refresh below
    }
  }

  if (refreshToken) {
    const nextAccessToken = await refreshAccessToken(refreshToken);
    if (nextAccessToken) {
      try {
        return await fetchMe(nextAccessToken);
      } catch {
        // refresh token valid but user fetch failed
      }
    }
  }

  return null;
});
