"use client";

import { useEffect } from "react";
import { useAuth, type User } from "@/context/AuthContext";

/**
 * Pushes a server-resolved session into AuthContext after streaming.
 * Rendered by a Suspense boundary in the (root) layout so the shell stays
 * static while the cookie read resolves in a dynamic hole.
 */
export default function AuthSeed({ user }: { user: User | null }) {
  const { seedUser } = useAuth();

  useEffect(() => {
    seedUser(user);
  }, [seedUser, user]);

  return null;
}
