// components/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, LoginResponse, LoginBodyEmail, LoginBodyPhone, MeResponse, User } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginWithEmail: (payload: LoginBodyEmail) => Promise<void>;
  loginWithPhone: (payload: LoginBodyPhone) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Init from localStorage
  useEffect(() => {
    const t = localStorage.getItem("cs_token");
    if (t) setToken(t);
    setLoading(false);
  }, []);

  // Fetch /me when token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      // si on est sur une page protégée et pas de token → go /login
      const isAuthRoute = pathname?.startsWith("/login");
      if (!isAuthRoute) router.replace("/login");
      return;
    }
    (async () => {
      try {
        const { user } = await api.get<MeResponse>("/api/auth/me");
        setUser(user);
      } catch {
        // token invalide
        localStorage.removeItem("cs_token");
        setToken(null);
        setUser(null);
        router.replace("/login");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loginCore = async (body: Record<string, string>) => {
    const res = await api.post<LoginResponse, typeof body>("/api/auth/login", body);
    localStorage.setItem("cs_token", res.token);
    setToken(res.token);
    setUser(res.user);
    router.replace("/"); // redirection après login
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    loading,
    loginWithEmail: (payload) => loginCore(payload),
    loginWithPhone: (payload) => loginCore(payload),
    logout: () => {
      localStorage.removeItem("cs_token");
      setToken(null);
      setUser(null);
      router.replace("/login");
    },
    refreshMe: async () => {
      const { user } = await api.get<MeResponse>("/api/auth/me");
      setUser(user);
    },
  }), [user, token, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

