import { lazy } from "react";

export const ArticleCreateView = lazy(() => import("@/views/ArticleCreate"));
export const ArticleView = lazy(() => import("@/views/Article"));
export const LoginView = lazy(() => import("@/views/Login"));
export const ProfileView = lazy(() => import("@/views/Profile"));
export const RankingView = lazy(() => import("@/views/Ranking"));
export const SearchView = lazy(() => import("@/views/Search"));
export const SettingsPasswordView = lazy(
  () => import("@/views/Settings/Password"),
);
export const SettingsView = lazy(() => import("@/views/Settings"));
export const SubjectDetailView = lazy(() => import("@/views/SubjectDetail"));
