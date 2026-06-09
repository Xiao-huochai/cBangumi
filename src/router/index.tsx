import { createBrowserRouter, Navigate } from "react-router-dom";

import { MainLayout } from "@/components/MainLayout";
import { LazyRoute } from "@/router/LazyRoute";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { PublicOnlyRoute } from "@/router/PublicOnlyRoute";
import {
  LoginView,
  ProfileView,
  RankingView,
  SubjectDetailView,
} from "@/router/lazyViews";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/ranking" replace />,
      },
      {
        path: "ranking",
        element: (
          <LazyRoute>
            <RankingView />
          </LazyRoute>
        ),
      },
      {
        path: "subjects/:subjectId",
        element: (
          <LazyRoute>
            <SubjectDetailView />
          </LazyRoute>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: (
              <LazyRoute>
                <ProfileView />
              </LazyRoute>
            ),
          },
        ],
      },
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "login",
            element: (
              <LazyRoute>
                <LoginView />
              </LazyRoute>
            ),
          },
        ],
      },
    ],
  },
]);
