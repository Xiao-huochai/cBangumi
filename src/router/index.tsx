import { createBrowserRouter, Navigate } from "react-router-dom";

import { MainLayout } from "@/components/MainLayout";
import { AdminRoute } from "@/router/AdminRoute";
import { LazyRoute } from "@/router/LazyRoute";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { PublicOnlyRoute } from "@/router/PublicOnlyRoute";
import {
  ArticleCreateView,
  ArticleView,
  LoginView,
  ProfileView,
  RankingView,
  SearchView,
  SubjectDetailView,
} from "@/router/lazyViews";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/articles" replace />,
      },
      {
        path: "articles",
        element: (
          <LazyRoute>
            <ArticleView />
          </LazyRoute>
        ),
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
        path: "search",
        element: (
          <LazyRoute>
            <SearchView />
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
            element: <AdminRoute />,
            children: [
              {
                path: "articles/new",
                element: (
                  <LazyRoute>
                    <ArticleCreateView />
                  </LazyRoute>
                ),
              },
            ],
          },
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
