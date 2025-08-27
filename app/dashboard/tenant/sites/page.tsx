"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Site = {
  id: number;
  name: string;
  location: string;
};

export default function SitesPage() {
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Sites</h2>
      {loading && <p>Chargement...</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Nom</th>
            <th className="p-3 border-b">Localisation</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{s.id}</td>
              <td className="p-3 border-b">{s.name}</td>
              <td className="p-3 border-b">{s.location}</td>
              <td className="p-3 border-b">
                <Link
                  href={`/dashboard/tenant/sites/${s.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

