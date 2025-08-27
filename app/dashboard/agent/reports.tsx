"use client";

import { useEffect, useState } from "react";
import { FaFileAlt, FaPlus } from "react-icons/fa";

type Report = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  location: string;
  createdAt: string;
};

export default function AgentReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/reports`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AGENT_TOKEN}`,
        },
      });
      const data = await res.json();
      setReports(data);
      setLoading(false);
    };
    fetchReports();
  }, []);

  const createReport = async () => {
    const title = prompt("Titre ?");
    const description = prompt("Description ?");
    if (!title || !description) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AGENT_TOKEN}`,
      },
      body: JSON.stringify({
        title,
        description,
        category: "incident",
        priority: "medium",
        location: "Non spécifiée",
      }),
    });
    const newReport = await res.json();
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Mes rapports</h2>
      <div className="flex justify-end mb-4">
        <button onClick={createReport} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded">
          <FaPlus className="mr-2" /> Nouveau rapport
        </button>
      </div>
      {loading && <p>Chargement...</p>}
      <ul className="space-y-2">
        {reports.map((r) => (
          <li key={r.id} className="bg-white p-3 shadow rounded">
            <p className="font-bold">{r.title}</p>
            <p className="text-gray-500">{r.description}</p>
            <small className="text-gray-400">
              {new Date(r.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

