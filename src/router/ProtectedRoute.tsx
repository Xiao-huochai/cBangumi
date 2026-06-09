import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/store";

export function ProtectedRoute() {
  const location = useLocation();
  const { initialized, isAuthenticated } = useAuthStore();

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
