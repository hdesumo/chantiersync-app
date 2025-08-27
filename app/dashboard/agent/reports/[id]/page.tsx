"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Report = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  location: string;
  createdAt: string;
};

export default function ReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/reports/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AGENT_TOKEN}`,
          },
        });
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Erreur chargement rapport", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!report) return <p>Rapport introuvable.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Détail Rapport</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="font-semibold">Titre : {report.title}</p>
        <p className="text-gray-600">Description : {report.description}</p>
        <p className="text-gray-600">Catégorie : {report.category}</p>
        <p className="text-gray-600">Priorité : {report.priority}</p>
        <p className="text-gray-600">Lieu : {report.location}</p>
        <p className="text-gray-600">
          Créé le : {new Date(report.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

