// app/public/sites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { listSites, createSite, siteQrPngUrl } from "@/lib/api";

interface Site {
  id: string;
  name: string;
  slug: string;
}

export default function PublicSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSiteName, setNewSiteName] = useState("");

  // Charger la liste des sites au montage
  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        const data = await listSites();
        setSites(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des sites");
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  // Ajouter un site
  async function handleAddSite(e: React.FormEvent) {
    e.preventDefault();
    if (!newSiteName) return;

    try {
      const created = await createSite({ name: newSiteName });
      setSites((prev) => [...prev, created]);
      setNewSiteName("");
    } catch (err: any) {
      alert(err.message || "Erreur lors de la création du site");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sites publics</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddSite} className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newSiteName}
          onChange={(e) => setNewSiteName(e.target.value)}
          placeholder="Nom du site"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>

      {/* Liste */}
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {sites.map((site) => (
          <li key={site.id} className="p-4 border rounded shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium">{site.name}</span>
              <img
                src={siteQrPngUrl(site.id)}
                alt={`QR ${site.name}`}
                className="w-16 h-16"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

