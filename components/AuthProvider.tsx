"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // 🔹 Charger user/token depuis localStorage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem("cs_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Connexion → on stocke user et token en localStorage
  const login = (user: User, token: string) => {
    localStorage.setItem("cs_user", JSON.stringify(user));
    localStorage.setItem("cs_token", token);
    setUser(user);
  };

  // 🔹 Déconnexion → nettoyage
  const logout = () => {
    localStorage.removeItem("cs_user");
    localStorage.removeItem("cs_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour accéder facilement au contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
