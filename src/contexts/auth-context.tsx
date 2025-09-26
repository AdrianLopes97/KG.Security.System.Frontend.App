import type { LoginResponse } from "@/interfaces/auth/login-response";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Centralized storage key for auth token
export const ACCESS_TOKEN_STORAGE_KEY = "accessToken"; // keep same key used previously for continuity

// Augment globalThis for a lightweight token cache (non-reactive)
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __ACCESS_TOKEN?: string | null;
  }
}

interface AuthContextValue {
  accessToken: string | null;
  isAuthenticated: boolean;
  // In future we can store decoded user info here
  login: (data: LoginResponse) => void;
  logout: () => void;
  // Helper to force refresh token retrieval if needed later
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  // Keep an in-memory cache so axios interceptor (which might load before re-render) can read latest token
  window.__ACCESS_TOKEN = accessToken;

  const login = useCallback((data: LoginResponse) => {
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      try {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data.accessToken);
      } catch {
        // ignore quota / availability errors
      }
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    try {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Sync across tabs (storage event)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === ACCESS_TOKEN_STORAGE_KEY) {
        setAccessToken(e.newValue);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      accessToken,
      isAuthenticated: !!accessToken,
      login,
      logout,
      getAccessToken: () => accessToken,
    }),
    [accessToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
