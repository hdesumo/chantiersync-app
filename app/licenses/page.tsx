"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";   // ✅ corrigé
import { getLicenses } from "@/lib/licenseApi";     // ✅ corrigé

export default function LicensesPage() {
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

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Licences</h1>
      <p className="text-sm text-gray-500 mb-4">
        Connecté en tant que : {user?.email || "Utilisateur"}
      </p>
      <ul>
        {licenses.map((l, i) => (
          <li key={i} className="border p-2 mb-2 rounded">
            {l.key} – <span className="font-semibold">{l.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

