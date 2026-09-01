import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getCurrentUser, login, logout } from "@/api";
import type { AuthUser } from "@/api/auth";
import { ApiError } from "@/api/client";

export const currentUserQueryKey = ["auth", "current-user"] as const;
const CURRENT_USER_STALE_TIME = 1000 * 60 * 5;

interface SignInVariables {
  account: string;
  password: string;
}

function isUnauthorizedError(error: unknown) {
  if (error instanceof ApiError) {
    return error.code === 401;
  }

  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }

  return false;
}

async function queryCurrentUser(): Promise<AuthUser | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return null;
    }

    throw error;
  }
}

export function useAuth() {
  const currentUserQuery = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: queryCurrentUser,
    retry: false,
    staleTime: CURRENT_USER_STALE_TIME,
  });
  const user = currentUserQuery.data ?? null;
  const initialized = !currentUserQuery.isPending;

  return {
    ...currentUserQuery,
    initialized,
    isAuthenticated: Boolean(user),
    isLoading: currentUserQuery.isPending,
    user,
  };
}

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ account, password }: SignInVariables) =>
      login(account, password),
    onSuccess: (result) => {
      queryClient.setQueryData(currentUserQueryKey, result.user);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      await queryClient.cancelQueries();
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== currentUserQueryKey[0],
      });
      queryClient.setQueryData(currentUserQueryKey, null);
    },
  });
}
