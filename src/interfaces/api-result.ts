export interface ApiResultSuccess<T> {
  success: true;
  content?: T;
  message?: string | null;
}

export interface ApiResultError {
  success: false;
  message: string; // mensagem legível principal
  error?: string | null; // detalhe técnico opcional
}

export type ApiResult<T> = ApiResultSuccess<T> | ApiResultError;

export function isApiResultSuccess<T>(r: ApiResult<T>): r is ApiResultSuccess<T> {
  return r.success === true;
}

export function isApiResultError<T>(r: ApiResult<T>): r is ApiResultError {
  return r.success === false;
}

export class ApiError extends Error {
  public readonly payload?: ApiResultError;
  constructor(message: string, payload?: ApiResultError) {
    super(message);
    this.name = "ApiError";
    this.payload = payload;
  }
}

/**
 * Desempacota um ApiResult.
 * - Se success=true retorna `content` (ou objeto vazio se undefined)
 * - Se success=false lança `ApiError` preservando mensagem e erro
 */
export function unwrapApiResult<T>(result: ApiResult<T>): T {
  if (isApiResultSuccess(result)) {
    return (result.content as T) ?? ({} as T);
  }
  throw new ApiError(result.message, result);
}
