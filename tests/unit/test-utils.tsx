import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { PropsWithChildren } from "react";

import { useAuthStore } from "@/store";
import type { AuthUser } from "@/api/auth";

export const testUser: AuthUser = {
  id: 101,
  name: "测试用户",
  avatarId: "",
  isAdmin: false,
  createdAt: "2026-01-01T00:00:00",
  updatedAt: "2026-01-01T00:00:00",
};

export function resetAuth(user: AuthUser | null = null) {
  useAuthStore.setState({
    status: user ? "authenticated" : "anonymous",
    user,
    initialized: true,
    isAuthenticated: Boolean(user),
    isLoading: false,
  });
}

export function createTestWrapper(initialEntries = ["/"]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function TestWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return { queryClient, TestWrapper };
}
