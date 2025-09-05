"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AgentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role !== "AGENT") {
    router.push("/403");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tableau de bord Agent</h1>
      <p className="mt-4">Bienvenue {user.email}</p>
    </div>
  );
}
