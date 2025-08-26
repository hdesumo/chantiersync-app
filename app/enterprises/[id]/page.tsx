"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../api";
import { useAuth } from "../../AuthProvider";

interface Enterprise {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  managers?: any[];
  agents?: any[];
  sites?: any[];
  reports?: any[];
  license?: {
    type: string;
    start_date: string;
    end_date: string;
    max_users: number;
    status: string;
  };
}

export default function EnterpriseDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();

  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEnterprise = async () => {
    try {
      const res = await api.get(`/enterprises/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnterprise(res.data);
    } catch (err) {
      console.error("Erreur fetch entreprise", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) fetchEnterprise();
  }, [id, token]);

  if (loading) {
    return <p className="p-6 text-gray-600">Chargement...</p>;
  }

  if (!enterprise) {
    return <p className="p-6 text-red-600">Entreprise introuvable</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-6"
      >
        ← Retour
      </button>

      <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
        {enterprise.logo && (
          <img
            src={enterprise.logo}
            alt={enterprise.name}
            className="w-20 h-20 object-cover rounded-full border"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            {enterprise.name}
          </h1>
          <p className="text-gray-600">{enterprise.address}</p>
          <p className="text-gray-600">{enterprise.phone}</p>
        </div>
      </div>

      {/* ✅ Dashboard simple */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-blue-700">
            {enterprise.sites?.length || 0}
          </p>
          <p className="text-gray-600">Sites</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-green-700">
            {enterprise.managers?.length || 0}
          </p>
          <p className="text-gray-600">Managers</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-purple-700">
            {enterprise.agents?.length || 0}
          </p>
          <p className="text-gray-600">Agents</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-red-700">
            {enterprise.reports?.length || 0}
          </p>
          <p className="text-gray-600">Rapports</p>
        </div>
      </div>

      {/* ✅ Nouvelle section Licence */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Licence</h2>
        {enterprise.license ? (
          <ul className="space-y-2">
            <li>
              <strong>Type :</strong> {enterprise.license.type}
            </li>
            <li>
              <strong>Période :</strong>{" "}
              {new Date(enterprise.license.start_date).toLocaleDateString()} →{" "}
              {new Date(enterprise.license.end_date).toLocaleDateString()}
            </li>
            <li>
              <strong>Max utilisateurs :</strong> {enterprise.license.max_users}
            </li>
            <li>
              <strong>Statut :</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  enterprise.license.status === "active"
                    ? "bg-green-600"
                    : enterprise.license.status === "expired"
                    ? "bg-red-600"
                    : "bg-yellow-600"
                }`}
              >
                {enterprise.license.status}
              </span>
            </li>
          </ul>
        ) : (
          <p className="text-gray-500">Aucune licence attribuée</p>
        )}
      </div>

      {/* ✅ Actions SuperAdmin */}
      <div className="mt-6 flex space-x-2">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Suspendre
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Supprimer
        </button>
      </div>
    </div>
  );
}

