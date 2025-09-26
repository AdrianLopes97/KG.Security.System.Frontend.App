import { env } from "@/env";
import type { ApiResult, ApiResultError, ApiResultSuccess } from "@/interfaces/api-result";
import { ApiError, isApiResultError, isApiResultSuccess } from "@/interfaces/api-result";
import axios, { AxiosHeaders, isAxiosError } from "axios";

// Augment window for token (aligned with AuthContext)
declare global {
  interface Window {
    __ACCESS_TOKEN?: string | null;
  }
}

export const api = axios.create({
  baseURL: env.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach Authorization header if access token exists (kept simple; refresh logic can be added later)
api.interceptors.request.use((config) => {
  const token = window.__ACCESS_TOKEN ?? localStorage.getItem("accessToken");
  if (token) {
    if (!config.headers) config.headers = new AxiosHeaders();
    const headers = config.headers as AxiosHeaders;
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data as unknown;
    if (data && typeof data === "object" && "success" in data) {
      const apiData = data as ApiResult<unknown>;
      if (isApiResultSuccess(apiData)) {
        const successData: ApiResultSuccess<unknown> = apiData;
        return { ...response, data: successData.content };
      }
      if (isApiResultError(apiData)) {
        const errorData: ApiResultError = apiData;
        throw new ApiError(errorData.message, errorData);
      }
    }
    return response;
  },
  (error) => {
    if (isAxiosError(error)) return Promise.reject(error);
    if (error instanceof Error) return Promise.reject(error);
    return Promise.reject(new Error(typeof error === "string" ? error : "Erro desconhecido"));
  }
);
