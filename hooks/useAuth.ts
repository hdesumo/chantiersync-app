// hooks/useAuth.ts
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, verifyToken } from "@/lib/api";

type User = {
  id: string;
  email: string;
  role: "SUPERADMIN" | "TENANT" | "AGENT";
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: {
    email?: string;
    password?: string;
    full_mobile?: string;
    pin?: string;
  }) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      verifyToken(token)
        .then((data) => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  /** ✅ Login avec un seul argument */
  async function login(credentials: {
    email?: string;
    password?: string;
    full_mobile?: string;
    pin?: string;
  }): Promise<User> {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      document.cookie = `token=${data.token}; path=/;`;
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
      setLoading(false);
      throw err;
    }
  }

  /** Déconnexion */
  function logout() {
    logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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
