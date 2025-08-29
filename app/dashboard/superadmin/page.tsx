"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";   // ✅ corrigé
import { getLicenses } from "@/lib/licenseApi";     // ✅ corrigé

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const data = await getLicenses();
        setLicenses(data);
      } catch (err) {
        console.error("Erreur récupération licences", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  if (loading) return <p>Chargement...</p>;

  const activeCount = licenses.filter((l) => l.status === "active").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="font-bold text-lg">SuperAdmin</h2>
        <p className="text-sm text-gray-600">
          Licences actives : {activeCount}
        </p>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        <p className="mb-6">Bienvenue {user?.email || "SuperAdmin"} 👋</p>
        <div className="grid grid-cols-2 gap-4">
          {licenses.map((l, i) => (
            <div key={i} className="p-4 border rounded bg-white shadow-sm">
              <p className="font-semibold">{l.key}</p>
              <p className="text-sm text-gray-500">{l.status}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

