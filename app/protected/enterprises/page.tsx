// app/protected/enterprises/page.tsx
import React from "react";
import { serverApiFetch } from "@/lib/api";

export default async function EnterprisesPage() {
  let enterprises: any[] = [];

  try {
    enterprises = await serverApiFetch("/enterprises");
  } catch (err) {
    console.error("Erreur récupération enterprises:", err);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Entreprises</h1>
      {enterprises.length === 0 ? (
        <p>Aucune entreprise trouvée.</p>
      ) : (
        <ul className="space-y-2">
          {enterprises.map((e: any) => (
            <li key={e.id} className="p-3 border rounded bg-gray-50">
              <strong>{e.name}</strong>
              <p>{e.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
