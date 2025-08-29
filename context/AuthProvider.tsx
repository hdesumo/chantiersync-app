"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import clientApi from "@/lib/clientApi";

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: { email?: string; password?: string; full_mobile?: string; pin?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifie la session au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      clientApi
        .get("/api/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Fonction login
  const login = async (credentials: { email?: string; password?: string; full_mobile?: string; pin?: string }) => {
    try {
      // ✅ correction : on tape sur /api/auth/login (backend)
      const res = await clientApi.post("/api/auth/login", credentials);

      console.log("LOGIN RESPONSE", res.data); // 👈 Debug visible côté terminal

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      } else {
        throw new Error("Token manquant dans la réponse");
      }
    } catch (err) {
      console.error("Erreur login:", err);
      throw err;
    }
  };

  // Fonction logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}

