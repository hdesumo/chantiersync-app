"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Enterprise = {
  id: number;
  name: string;
  licenseStatus: string;
};

export default function EnterprisesPage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprises`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPERADMIN_TOKEN}`,
          },
        });
        const data = await res.json();
        setEnterprises(data);
      } catch (err) {
        console.error("Erreur chargement entreprises", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnterprises();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Entreprises (Tenants)</h2>
      {loading && <p>Chargement...</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Nom</th>
            <th className="p-3 border-b">Licence</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enterprises.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{e.id}</td>
              <td className="p-3 border-b">{e.name}</td>
              <td className="p-3 border-b">{e.licenseStatus}</td>
              <td className="p-3 border-b">
                <Link
                  href={`/dashboard/superadmin/enterprises/${e.id}`}
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

