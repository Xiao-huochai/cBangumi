import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store";

export function AdminRoute() {
  const { initialized, user } = useAuthStore();

  if (!initialized) {
    return null;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/articles" replace />;
  }

  return <Outlet />;
}
