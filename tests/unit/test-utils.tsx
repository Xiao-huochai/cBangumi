import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import type { PropsWithChildren } from "react";

import type { AuthUser } from "@/api/auth";
import { currentUserQueryKey } from "@/hooks";

export const testUser: AuthUser = {
  id: 101,
  name: "测试用户",
  avatarId: "",
  isAdmin: false,
  createdAt: "2026-01-01T00:00:00",
  updatedAt: "2026-01-01T00:00:00",
};

export function createTestWrapper(
  initialEntries: MemoryRouterProps["initialEntries"] = ["/"],
  currentUser?: AuthUser | null,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  if (currentUser !== undefined) {
    queryClient.setQueryData(currentUserQueryKey, currentUser);
  }

  function TestWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return { queryClient, TestWrapper };
}
