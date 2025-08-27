"use client";

import { useEffect, useState } from "react";
import { FaBuilding, FaKey } from "react-icons/fa";

type License = {
  id: number;
  status: "active" | "expired" | "pending";
  expiresAt: string;
};

type Company = {
  id: number;
  name: string;
  address: string;
  license: License;
};

export default function TenantDashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
          },
        });
        if (!res.ok) throw new Error("Erreur API Tenant");
        const data = await res.json();
        setCompany(data.company);
      } catch (err: any) {
        setError("Impossible de charger les infos de l’entreprise.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tenant Admin – Entreprise</h2>
      {loading && <p className="text-gray-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {company && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <FaBuilding className="text-blue-600 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Entreprise</p>
              <p className="text-xl font-bold">{company.name}</p>
              <p className="text-sm text-gray-500">{company.address}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <FaKey className="text-green-600 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Licence</p>
              <p className="text-xl font-bold">{company.license.status}</p>
              <small className="text-gray-500">
                Expire {company.license.expiresAt}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

