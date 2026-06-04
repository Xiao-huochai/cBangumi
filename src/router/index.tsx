import { createBrowserRouter, Navigate } from "react-router-dom";

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
    element: <Navigate to="/ranking" replace />,
  },
  {
    path: "/ranking",
    element: (
      <LazyRoute>
        <RankingView />
      </LazyRoute>
    ),
  },
  {
    path: "/subjects/:subjectId",
    element: (
      <LazyRoute>
        <SubjectDetailView />
      </LazyRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <LazyRoute>
        <ProfileView />
      </LazyRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <LazyRoute>
        <LoginView />
      </LazyRoute>
    ),
  },
]);
