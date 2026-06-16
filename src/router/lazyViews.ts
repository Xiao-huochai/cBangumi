import { lazy } from "react";

export const ArticleView = lazy(() => import("@/views/Article"));
export const LoginView = lazy(() => import("@/views/Login"));
export const ProfileView = lazy(() => import("@/views/Profile"));
export const RankingView = lazy(() => import("@/views/Ranking"));
export const SubjectDetailView = lazy(() => import("@/views/SubjectDetail"));
