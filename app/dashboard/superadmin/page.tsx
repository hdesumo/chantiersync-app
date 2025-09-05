"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SuperAdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "SUPERADMIN") {
      router.push("/403");
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tableau de bord SuperAdmin</h1>
      <p>Bienvenue, {user.email}</p>
    </div>
  );
}
