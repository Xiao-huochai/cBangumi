import { createContext } from "react";

import type { AuthUser } from "@/api/auth";

export interface AuthContextValue {
  initialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  refreshUser: () => Promise<AuthUser | null>;
  signIn: (account: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
