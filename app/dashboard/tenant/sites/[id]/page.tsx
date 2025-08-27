"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Site = {
  id: number;
  name: string;
  location: string;
  createdAt: string;
};

export default function SiteDetailPage() {
  const { id } = useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSite = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/sites/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
        },
      });
      const data = await res.json();
      setSite(data);
      setLoading(false);
    };
    if (id) fetchSite();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!site) return <p>Site introuvable.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Détail Site</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="font-semibold">Nom : {site.name}</p>
        <p className="text-gray-600">Localisation : {site.location}</p>
        <p className="text-gray-600">Créé le : {new Date(site.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

