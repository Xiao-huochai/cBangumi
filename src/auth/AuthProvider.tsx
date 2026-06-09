import {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { AxiosError } from "axios";

import { getCurrentUser, login, logout } from "@/api";
import { ApiError } from "@/api/client";
import type { AuthUser } from "@/api/auth";
import { AuthContext, type AuthContextValue } from "@/auth/context";

type AuthStatus = "checking" | "authenticated" | "anonymous";

function isUnauthorizedError(error: unknown) {
  if (error instanceof ApiError) {
    return error.code === 401;
  }

  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }

  return false;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<AuthUser | null>(null);
  const requestRef = useRef<Promise<AuthUser | null> | null>(null);

  async function refreshUser() {
    if (requestRef.current) {
      return requestRef.current;
    }

    const request = (async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setStatus("authenticated");
        return currentUser;
      } catch (error) {
        if (isUnauthorizedError(error)) {
          setUser(null);
          setStatus("anonymous");
          return null;
        }

        throw error;
      } finally {
        requestRef.current = null;
      }
    })();

    requestRef.current = request;
    return request;
  }

  async function signIn(account: string, password: string) {
    const result = await login(account, password);
    setUser(result.user);
    setStatus("authenticated");
    return result.user;
  }

  async function signOut() {
    try {
      await logout();
    } finally {
      setUser(null);
      setStatus("anonymous");
    }
  }

  useEffect(() => {
    void refreshUser().catch(() => {
      setUser(null);
      setStatus("anonymous");
    });
  }, []);

  const value: AuthContextValue = {
    initialized: status !== "checking",
    isAuthenticated: status === "authenticated",
    isLoading: status === "checking",
    user,
    refreshUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
