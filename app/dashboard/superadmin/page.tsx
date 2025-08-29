// app/dashboard/superadmin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getLicenses, License } from "@/lib/licenseApi";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);

  useEffect(() => {
    async function fetchLicenses() {
      try {
        const data = await getLicenses();
        setLicenses(data);
      } catch (err) {
        console.error("Erreur chargement licenses", err);
      }
    }
    fetchLicenses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      <p className="mb-4">Bienvenue {user?.email}</p>

      <h2 className="text-xl font-semibold mb-2">Licenses</h2>
      <ul>
        {licenses.map((l) => (
          <li key={l.id}>
            {l.key} — {l.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
