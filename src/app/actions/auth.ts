"use server";

import { cookies } from "next/headers";
import { serverFetch } from "@/lib/api";

export async function loginAction(credentials: any) {
  try {
    const res = await serverFetch("/auth/jwt/create/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (res.access) {
      const cookieStore = await cookies();
      cookieStore.set("access_token", res.access, {
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
        httpOnly: true, // Securely handled by Next.js Middleware now!
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      cookieStore.set("refresh_token", res.refresh, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      let user = null;
      try {
        user = await serverFetch("/auth/users/me/", {
          headers: { Authorization: `Bearer ${res.access}` },
        });
      } catch (err) {
        console.error("Failed to fetch user in loginAction:", err);
      }

      return { success: true, user };
    }
    return { success: false, error: "Invalid response from server" };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Authentication failed",
      errorData: error.response?.data 
    };
  }
}

export async function registerAction(data: any) {
  try {
    const createdUser = await serverFetch("/auth/users/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    // Automatically log in after registration using phone or username
    const loginIdentifier = data.phone || data.username || createdUser?.username;
    return await loginAction({ username: loginIdentifier, password: data.password });
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Registration failed",
      errorData: error.response?.data 
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  return { success: true };
}
