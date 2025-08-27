"use client";

import { useEffect, useState } from "react";
import { FaBuilding, FaKey, FaFileAlt, FaSync } from "react-icons/fa";

type License = {
  id: number;
  company: string;
  status: "active" | "expired" | "pending";
  expiresAt: string;
};

export default function SuperAdminDashboard() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch licences au montage
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/licenses/mine`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPERADMIN_TOKEN}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Erreur API: ${res.status}`);

        const data = await res.json();
        setLicenses(data);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les licences.");
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  // Action: renouvellement licence
  const handleRenew = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/licenses/${id}/renew`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPERADMIN_TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Échec du renouvellement.");

      // Rafraîchir la liste après action
      const updated = await res.json();
      setLicenses((prev) =>
        prev.map((lic) => (lic.id === id ? updated : lic))
      );
      alert("Licence renouvelée ✅");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  // Statistiques pour widgets
  const activeCount = licenses.filter((l) => l.status === "active").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <a

