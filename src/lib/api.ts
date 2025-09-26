import { env } from "@/env";
import type { ApiResult, ApiResultError, ApiResultSuccess } from "@/interfaces/api-result";
import { ApiError, isApiResultError, isApiResultSuccess } from "@/interfaces/api-result";
import axios from "axios";

export const api = axios.create({
  baseURL: env.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    const data = response.data as unknown;
    if (data && typeof data === "object" && "success" in data) {
      const apiData = data as ApiResult<unknown>;
      if (isApiResultSuccess(apiData)) {
        const successData = apiData as ApiResultSuccess<unknown>;
        return { ...response, data: successData.content };
      }
      if (isApiResultError(apiData)) {
        const errorData = apiData as ApiResultError;
        throw new ApiError(errorData.message, errorData);
      }
    }
    return response;
  },
  (error) => {
    if (error instanceof Error) return Promise.reject(error);
    return Promise.reject(new Error(typeof error === "string" ? error : "Erro desconhecido"));
  }
);
