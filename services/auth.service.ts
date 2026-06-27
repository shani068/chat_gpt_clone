// Auth API calls — login, register, logout, and current-user fetch
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type {
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const res = await api.post<ApiResponse<AuthSession>>("/auth/login", credentials);
    return res.data.data;
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const res = await api.post<ApiResponse<User>>("/auth/register", credentials);
    return res.data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async me(): Promise<User> {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },
};
