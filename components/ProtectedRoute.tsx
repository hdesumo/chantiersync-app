"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Pas de token → redirection login
    if (!token) {
      router.replace("/login");
      return;
    }

    // 2. Vérification rôle vs route
    if (role === "tenant" && pathname.startsWith("/dashboard/superadmin")) {
      router.replace("/dashboard/tenant");
    }
    if (role === "agent" && !pathname.startsWith("/dashboard/agent")) {
      router.replace("/dashboard/agent");
    }
    if (role === "superadmin" && !pathname.startsWith("/dashboard/superadmin")) {
      router.replace("/dashboard/superadmin");
    }
  }, [token, role, pathname, router]);

  // Pendant la vérification → loader
  if (!token || !role) {
    return <p className="p-6 text-gray-500">Chargement...</p>;
  }

  return <>{children}</>;
}

