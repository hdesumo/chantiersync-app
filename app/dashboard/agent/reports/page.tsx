"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  id: number;
  title: string;
  category: string;
  priority: string;
  createdAt: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/reports`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AGENT_TOKEN}`,
          },
        });
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Erreur chargement rapports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Mes rapports</h2>
      {loading && <p>Chargement...</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Titre</th>
            <th className="p-3 border-b">Catégorie</th>
            <th className="p-3 border-b">Priorité</th>
            <th className="p-3 border-b">Date</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{r.id}</td>
              <td className="p-3 border-b">{r.title}</td>
              <td className="p-3 border-b">{r.category}</td>
              <td className="p-3 border-b">{r.priority}</td>
              <td className="p-3 border-b">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3 border-b">
                <Link
                  href={`/dashboard/agent/reports/${r.id}`}
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

