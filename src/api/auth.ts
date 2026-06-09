import { api } from "@/api/client";

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatarId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResult {
  tokenName: string;
  user: AuthUser;
}

export function login(account: string, password: string) {
  return api.post<LoginResult>("/api/auth/login", {
    account,
    password,
  });
}

export function getCurrentUser() {
  return api.get<AuthUser>("/api/auth/me");
}

export function logout() {
  return api.post<null>("/api/auth/logout");
}
