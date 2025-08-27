"use client";

import { useEffect, useState } from "react";
import { FaBuilding, FaPlus } from "react-icons/fa";

type Site = { id: number; name: string; location: string };

export default function TenantSitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/sites`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
        },
      });
      const data = await res.json();
      setSites(data);
      setLoading(false);
    };
    fetchSites();
  }, []);

  const createSite = async () => {
    const name = prompt("Nom du site ?");
    const location = prompt("Localisation du site ?");
    if (!name || !location) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/sites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
      },
      body: JSON.stringify({ name, location }),
    });
    const newSite = await res.json();
    setSites((prev) => [...prev, newSite]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Gestion des sites</h2>
      {loading && <p>Chargement...</p>}
      <div className="flex justify-end mb-4">
        <button onClick={createSite} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded">
          <FaPlus className="mr-2" /> Nouveau site
        </button>
      </div>
      <ul className="space-y-2">
        {sites.map((s) => (
          <li key={s.id} className="bg-white p-3 shadow rounded">
            {s.name} – <span className="text-gray-500">{s.location}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

