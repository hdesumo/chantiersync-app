"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import clientApi, { clientGet } from "@/lib/clientApi";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérification de la session existante
  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await clientGet("/auth/me"); // endpoint à adapter côté backend
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    // ⚡ Ici tu peux aussi stocker le token dans les cookies si nécessaire
    setUser(userData);
  };

  const logout = () => {
    // ⚡ Ici tu peux appeler l’API de logout et supprimer les cookies/token
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
