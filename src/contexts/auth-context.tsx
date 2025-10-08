import type { LoginResponse } from "@/interfaces/auth/login-response";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Centralized storage key for auth token
export const ACCESS_TOKEN_STORAGE_KEY = "accessToken"; // keep same key used previously for continuity
export const ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY = "accessTokenExpiresAt"; // epoch ms when token expires
// NOTE: When implementing refresh tokens in future, consider storing a refresh token separately
// and replacing auto-logout with a silent refresh flow a few seconds before expiry.

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
      const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      const expiresAtRaw = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
      if (token && expiresAtRaw) {
        const expiresAt = Number(expiresAtRaw);
        if (!Number.isNaN(expiresAt) && Date.now() >= expiresAt) {
          // Expired – clean up
          localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
          localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
          return null;
        }
      }
      return token;
    } catch {
      return null;
    }
  });

  // Keep latest expiration in ref for quick checks without triggering renders
  let initialExpiresAt: number | null = null;
  try {
    const v = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
    if (v) {
      const num = Number(v);
      initialExpiresAt = Number.isNaN(num) ? null : num;
    }
  } catch {
    // ignore
  }
  const expiresAtRef = useRef<number | null>(initialExpiresAt);

  // Keep an in-memory cache so axios interceptor (which might load before re-render) can read latest token
  window.__ACCESS_TOKEN = accessToken;

  const login = useCallback((data: LoginResponse) => {
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      try {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data.accessToken);
        // expiresIn is seconds according to interface; convert to ms and store epoch
        if (data.expiresIn && data.expiresIn > 0) {
          const expiresAt = Date.now() + data.expiresIn * 1000;
          localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY, String(expiresAt));
          expiresAtRef.current = expiresAt;
        } else {
          // If API returned zero/invalid, clear any previous expiration to force session-only behaviour
          localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
          expiresAtRef.current = null;
        }
      } catch {
        // ignore quota / availability errors
      }
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    expiresAtRef.current = null;
    try {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // Sync across tabs (storage event)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === ACCESS_TOKEN_STORAGE_KEY) {
        setAccessToken(e.newValue);
      } else if (e.key === ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY) {
        expiresAtRef.current = e.newValue ? Number(e.newValue) : null;
        if (expiresAtRef.current && Date.now() >= expiresAtRef.current) {
          // Another tab already expired it
          setAccessToken(null);
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Auto logout timer scheduling
  useEffect(() => {
    if (!accessToken) return; // no token no timer
    const expiresAt = expiresAtRef.current;
    if (!expiresAt) return; // session token without expiration
    const now = Date.now();
    if (now >= expiresAt) {
      logout();
      return;
    }
    const timeoutMs = expiresAt - now;
    const id = window.setTimeout(() => {
      // safety double-check
      if (expiresAtRef.current && Date.now() >= expiresAtRef.current) {
        logout();
      }
    }, timeoutMs + 50); // small buffer
    return () => clearTimeout(id);
  }, [accessToken, logout]);

  // Defensive: if system clock jumps forward
  useEffect(() => {
    const id = window.setInterval(() => {
      if (accessToken && expiresAtRef.current && Date.now() >= expiresAtRef.current) {
        logout();
      }
    }, 60_000); // check every minute
    return () => clearInterval(id);
  }, [accessToken, logout]);

  const value: AuthContextValue = useMemo(
    () => ({
      accessToken,
      // isAuthenticated only true if token exists and (no expiration) or not expired
      isAuthenticated: !!accessToken && (!expiresAtRef.current || Date.now() < expiresAtRef.current),
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
