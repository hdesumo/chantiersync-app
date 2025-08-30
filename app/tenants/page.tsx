// app/tenants/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { clientGet } from "@/lib/clientApi";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientGet("/tenants")
      .then((data) => setTenants(data || []))
      .catch((err) => console.error("Erreur fetch tenants:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des tenants...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Liste des Tenants</h1>
      {tenants.length === 0 ? (
        <p>Aucun tenant trouvé.</p>
      ) : (
        <ul className="list-disc pl-6">
          {tenants.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
