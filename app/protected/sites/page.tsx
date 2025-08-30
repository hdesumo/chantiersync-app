// app/protected/sites/page.tsx
import React from "react";
import { serverApiFetch } from "@/lib/api";

export default async function SitesPage() {
  let sites: any[] = [];

  try {
    sites = await serverApiFetch("/sites");
  } catch (err) {
    console.error("Erreur récupération sites:", err);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sites</h1>
      {sites.length === 0 ? (
        <p>Aucun site trouvé.</p>
      ) : (
        <ul className="space-y-2">
          {sites.map((s: any) => (
            <li key={s.id} className="p-3 border rounded bg-gray-50">
              <strong>{s.name}</strong>
              <p>{s.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
