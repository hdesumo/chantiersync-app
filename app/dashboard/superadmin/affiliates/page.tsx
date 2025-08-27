"use client";

import { useEffect, useState } from "react";
import { FaUserTie, FaPlus } from "react-icons/fa";
import Link from "next/link";

type Affiliate = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  status: "active" | "inactive";
};

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliates = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/affiliates`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPERADMIN_TOKEN}`,
        },
      });
      const data = await res.json();
      setAffiliates(data);
      setLoading(false);
    };
    fetchAffiliates();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Affiliés</h2>
        <Link
          href="/dashboard/superadmin/affiliates/new"
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" /> Nouvel affilié
        </Link>
      </div>

      {loading && <p className="text-gray-500">Chargement...</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Nom</th>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Statut</th>
            <th className="p-3 border-b">Créé le</th>
          </tr>
        </thead>
        <tbody>
          {affiliates.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{a.id}</td>
              <td className="p-3 border-b">{a.name}</td>
              <td className="p-3 border-b">{a.email}</td>
              <td className="p-3 border-b">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    a.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="p-3 border-b">
                {new Date(a.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

