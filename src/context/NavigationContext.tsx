"use client";

import { createContext, useContext } from "react";
import type { Category } from "@/types";

/**
 * Header menu data fetched once on the server (in app/[lang]/layout.tsx)
 * and shared with client components (Header, mobile menu) via context.
 * This avoids prop-drilling into the many pages that render <Header />.
 */
const NavigationContext = createContext<Category[]>([]);

export function NavigationProvider({
  menu,
  children,
}: {
  menu: Category[];
  children: React.ReactNode;
}) {
  return <NavigationContext.Provider value={menu}>{children}</NavigationContext.Provider>;
}

export function useNavigationMenu(): Category[] {
  return useContext(NavigationContext);
}
