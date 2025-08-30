// app/licenses/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getLicenses } from "@/lib/licenseApi";

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLicenses()
      .then((data) => setLicenses(data || []))
      .catch((err) => console.error("Erreur fetch licenses:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des licences...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Licences</h1>
      {licenses.length === 0 ? (
        <p>Aucune licence trouvée.</p>
      ) : (
        <ul className="list-disc pl-6">
          {licenses.map((l) => (
            <li key={l.id}>{l.key}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
