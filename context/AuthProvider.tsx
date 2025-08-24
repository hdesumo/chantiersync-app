'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin } from '@/lib/api';

type AuthLoginResponse = {
  token: string;
  user?: {
    id: string;
    name?: string;
    role?: string;
    enterprise?: string;
  };
};

type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type AuthContextValue = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // Recharge le token depuis le localStorage au premier rendu client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  const login = async (email: string, password: string) => {
    // apiLogin renvoie ApiResult<AuthLoginResponse>
    const res = (await apiLogin(email, password)) as ApiResult<AuthLoginResponse>;

    if (!res?.ok || !res.data?.token) {
      // message d’erreur le plus précis possible
      throw new Error(res?.error || 'Échec de connexion');
    }

    const tok = res.data.token;
    setToken(tok);

    // Persistance simple
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', tok);
      document.cookie = `token=${tok}; Path=/; Max-Age=86400; Secure; SameSite=Lax`;
    }
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'token=; Path=/; Max-Age=0; Secure; SameSite=Lax';
    }
  };

  const value = useMemo(() => ({ token, login, logout }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

