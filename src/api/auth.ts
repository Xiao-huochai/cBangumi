import { api } from "@/api/client";

export interface AuthUser {
  id: number;
  name: string;
  avatarId: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResult {
  tokenName: string;
  user: AuthUser;
}

export interface CreatedUser extends AuthUser {
  phone?: string;
  email?: string;
}

export interface CreateUserPayload {
  name: string;
  phone?: string;
  email?: string;
  password: string;
}

export function login(account: string, password: string) {
  return api.post<LoginResult>("/api/auth/login", {
    account,
    password,
  });
}

export function createUser(data: CreateUserPayload) {
  return api.post<CreatedUser>("/api/users", data);
}

export function getCurrentUser() {
  return api.get<AuthUser>("/api/auth/me");
}

export function logout() {
  return api.post<null>("/api/auth/logout");
}
