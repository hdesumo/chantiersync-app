"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Pas connecté → renvoi login
        router.push("/login");
      } else {
        // Exemple : contrôle role/route
        if (pathname.startsWith("/dashboard/superadmin") && user.role !== "SUPERADMIN") {
          router.push("/403");
        }
        if (pathname.startsWith("/dashboard/tenant") && user.role !== "TENANT") {
          router.push("/403");
        }
        if (pathname.startsWith("/dashboard/agent") && user.role !== "AGENT") {
          router.push("/403");
        }
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <p className="p-6 text-gray-500">Chargement...</p>;
  }

  return <>{children}</>;
}
