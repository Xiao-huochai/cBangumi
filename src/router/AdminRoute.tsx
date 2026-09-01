import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks";

export function AdminRoute() {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/articles" replace />;
  }

  return <Outlet />;
}
