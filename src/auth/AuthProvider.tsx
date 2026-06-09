import { useEffect, type PropsWithChildren } from "react";

import { useAuthStore } from "@/store";

export function AuthProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    void useAuthStore.getState().refreshUser().catch(() => {
      useAuthStore.setState({
        status: "anonymous",
        user: null,
        initialized: true,
        isAuthenticated: false,
        isLoading: false,
      });
    });
  }, []);

  return children;
}
