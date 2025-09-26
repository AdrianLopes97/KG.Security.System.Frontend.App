import type { LoginCredentials } from "@/interfaces/auth/login-credentials";
import type { LoginResponse } from "@/interfaces/auth/login-response";
import { api } from "@/lib/api";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);
  return data;
}
