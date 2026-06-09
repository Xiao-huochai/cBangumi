import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";

export function ProtectedRoute() {
  const location = useLocation();
  const { initialized, isAuthenticated } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
