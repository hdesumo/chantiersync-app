// context/AuthProvider.tsx
'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from '@/lib/api';

type AuthContextShape = {
  token: string | null;
  user: any | null;
  login: (email: string, password: string, rememberDays?: number) => Promise<string>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
    'SameSite=Lax',
    isSecure ? 'Secure' : '',
  ].filter(Boolean).join('; ');
}
function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // hydrate depuis localStorage (coté client uniquement)
  useEffect(() => {
    try {
      const t = localStorage.getItem('cs_token');
      const u = localStorage.getItem('cs_user');
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const login = useCallback(async (email: string, password: string, rememberDays = 7) => {
    const res = await apiLogin(email, password); // { token, user? }
    setToken(res.token);
    setUser(res.user ?? null);
    // localStorage
    localStorage.setItem('cs_token', res.token);
    localStorage.setItem('cs_user', JSON.stringify(res.user ?? null));
    // cookie pour le middleware edge (Lax pour navigations)
    const maxAge = Math.max(1, Math.floor(rememberDays * 86400));
    setCookie('cs_token', res.token, maxAge);
    return res.token;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('cs_token');
      localStorage.removeItem('cs_user');
    } catch {}
    clearCookie('cs_token');
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

