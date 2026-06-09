import { AxiosError } from "axios";
import { create } from "zustand";

import { getCurrentUser, login, logout } from "@/api";
import { ApiError } from "@/api/client";
import type { AuthUser } from "@/api/auth";

type AuthStatus = "checking" | "authenticated" | "anonymous";

export interface AuthStoreState {
  status: AuthStatus;
  user: AuthUser | null;
  initialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  signIn: (account: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

let refreshUserRequest: Promise<AuthUser | null> | null = null;

function isUnauthorizedError(error: unknown) {
  if (error instanceof ApiError) {
    return error.code === 401;
  }

  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }

  return false;
}

function applyAuthState(status: AuthStatus, user: AuthUser | null) {
  return {
    status,
    user,
    initialized: status !== "checking",
    isAuthenticated: status === "authenticated",
    isLoading: status === "checking",
  };
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...applyAuthState("checking", null),

  async refreshUser() {
    if (refreshUserRequest) {
      return refreshUserRequest;
    }

    const request = (async () => {
      try {
        const currentUser = await getCurrentUser();
        set(applyAuthState("authenticated", currentUser));
        return currentUser;
      } catch (error) {
        if (isUnauthorizedError(error)) {
          set(applyAuthState("anonymous", null));
          return null;
        }

        throw error;
      } finally {
        refreshUserRequest = null;
      }
    })();

    refreshUserRequest = request;
    return request;
  },

  async signIn(account: string, password: string) {
    const result = await login(account, password);
    set(applyAuthState("authenticated", result.user));
    return result.user;
  },

  async signOut() {
    try {
      await logout();
    } finally {
      set(applyAuthState("anonymous", null));
    }
  },
}));
