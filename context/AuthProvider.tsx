// context/AuthProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, login as apiLogin } from '@/lib/api';

type AuthCtx = {
  token: string | null;
  setToken: (t: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, _setToken] = useState<string | null>(null);

  // charge depuis cookie/localStorage côté client
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cs_token');
      if (saved) _setToken(saved);
    } catch {}
  }, []);

  const setToken = (t: string | null) => {
    _setToken(t);
    try {
      if (t) localStorage.setItem('cs_token', t);
      else localStorage.removeItem('cs_token');
      // cookie simple pour fetch image <img>
      document.cookie = t
        ? `cs_token=${t}; Path=/; Max-Age=1209600; Secure; SameSite=Lax`
        : `cs_token=; Path=/; Max-Age=0; Secure; SameSite=Lax`;
    } catch {}
  };

  const login = async (email: string, password: string) => {
    const { token } = await apiLogin(email, password);
    setToken(token);
  };

  const logout = () => setToken(null);

  const value = useMemo<AuthCtx>(() => ({ token, setToken, login, logout }), [token]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

// ✅ export par défaut aussi (pour compat)
export default AuthProvider;

