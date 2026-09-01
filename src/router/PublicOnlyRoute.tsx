import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks";

export function PublicOnlyRoute() {
  const { initialized, isAuthenticated } = useAuth();

  if (!initialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
