"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Enterprise = {
  id: number;
  name: string;
  address: string;
  license: {
    id: number;
    status: string;
    expiresAt: string;
  };
};

export default function EnterpriseDetailPage() {
  const params = useParams();
  const { id } = params;
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnterprise = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprises/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPERADMIN_TOKEN}`,
          },
        });
        const data = await res.json();
        setEnterprise(data);
      } catch (err) {
        console.error("Erreur chargement entreprise", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEnterprise();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!enterprise) return <p>Entreprise introuvable.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Détail Entreprise</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="font-semibold">Nom : {enterprise.name}</p>
        <p className="text-gray-600">Adresse : {enterprise.address}</p>
        <p className="text-gray-600">
          Licence : {enterprise.license.status} (expire le{" "}
          {new Date(enterprise.license.expiresAt).toLocaleDateString()})
        </p>
      </div>
    </div>
  );
}

