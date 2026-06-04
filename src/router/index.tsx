import { createBrowserRouter, Navigate } from "react-router-dom";

import { MainLayout } from "../components/MainLayout";
import { LazyRoute } from "./LazyRoute";
import {
  LoginView,
  ProfileView,
  RankingView,
  SubjectDetailView,
} from "./lazyViews";

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
        path: "profile",
        element: (
          <LazyRoute>
            <ProfileView />
          </LazyRoute>
        ),
      },
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
]);
