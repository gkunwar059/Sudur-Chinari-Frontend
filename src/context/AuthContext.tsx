"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { loginAction, registerAction, logoutAction } from "@/app/actions/auth";
import toast from "react-hot-toast";

export interface User {
  id: number;
  email: string;
  username: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  seedUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  // Fallback hydration for logged-out sessions.
  // The [lang] layout resolves the session via getSessionUser() and passes
  // it as initialUser; the /api/v1 proxy injects the HttpOnly token.
  useEffect(() => {
    if (initialUser) return;
    let cancelled = false;
    apiFetch<User>("/auth/users/me/")
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialUser]);

  const login = async (credentials: any) => {
    const res = await loginAction(credentials);
    if (!res.success) {
      const err = new Error(res.error);
      if (res.errorData) (err as any).response = { data: res.errorData };
      throw err;
    }

    // On success, client-side cookie is set by server. Update state.
    let userRes = res.user;
    if (!userRes) {
      try {
        userRes = await apiFetch("/auth/users/me/");
      } catch (e) {
        console.warn("Fallback apiFetch for user failed:", e);
      }
    }
    if (userRes) {
      setUser(userRes);
      toast.success(`Welcome back, ${userRes.username}!`);
    }
  };

  const register = async (data: any) => {
    const res = await registerAction(data);
    if (!res.success) {
      const err = new Error(res.error);
      if (res.errorData) (err as any).response = { data: res.errorData };
      throw err;
    }

    let userRes = res.user;
    if (!userRes) {
      try {
        userRes = await apiFetch("/auth/users/me/");
      } catch (e) {
        console.warn("Fallback apiFetch for user failed:", e);
      }
    }
    if (userRes) {
      setUser(userRes);
      toast.success(
        `Account created successfully! Welcome, ${userRes.username}!`,
      );
    }
  };

  const logout = async () => {
    await logoutAction();
    setUser(null);
    toast.success("Successfully logged out");
  };

  const seedUser = (nextUser: User | null) => {
    setUser(nextUser);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, seedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
