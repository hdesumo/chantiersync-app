// app/public/sites/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { listSites, createSite, siteQrPngUrl } from "@/lib/api";

export default function PublicSitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSites()
      .then((data) => setSites(data || []))
      .catch((err) => console.error("Erreur fetch sites:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des sites...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Sites publics</h1>
      {sites.length === 0 ? (
        <p>Aucun site trouvé.</p>
      ) : (
        <ul className="list-disc pl-6">
          {sites.map((s) => (
            <li key={s.id}>
              {s.name} – <img src={siteQrPngUrl(s.id)} alt="QR Code" className="inline w-12 h-12 ml-2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
