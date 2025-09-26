// Extrai mensagem legível de um erro possivelmente vindo do Axios ou genérico
export function parseApiError(error: unknown, fallback = "Ocorreu um erro inesperado"): string {
  if (!error) return fallback;

  const maybeAxios = error as {
    response?: { data?: unknown; status?: number };
    message?: string;
  };

  function extractFromData(data: unknown): string | null {
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      const keys = ["message", "error", "detail", "mensagem", "erro"];
      for (const k of keys) {
        const v = obj[k];
        if (typeof v === "string" && v.trim()) return v;
      }
    }
    return null;
  }

  const rawData = maybeAxios.response?.data;
  const candidates: Array<string | null> = [
    extractFromData(rawData),
    typeof error === "string" ? error : null,
    maybeAxios.message || null,
  ];

  for (const c of candidates) {
    if (c) return c;
  }

  try {
    if (rawData !== undefined) return JSON.stringify(rawData);
  } catch {
    // ignore
  }
  return fallback;
}
