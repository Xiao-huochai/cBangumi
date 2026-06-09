import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store";

export function PublicOnlyRoute() {
  const { initialized, isAuthenticated } = useAuthStore();

  if (!initialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
