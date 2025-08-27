"use client";

import { useEffect, useState } from "react";
import { FaUserTie, FaCoins, FaLink } from "react-icons/fa";

type Partner = {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
  affiliateCode: string;
};

type Stats = {
  clicks: number;
  leads: number;
  conversions: number;
  commissions: number;
};

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/dashboard`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PARTNER_TOKEN}`,
        },
      });
      const data = await res.json();
      setPartner(data.partner);
      setStats(data.stats);
    };
    fetchData();
  }, []);

  if (!partner || !stats) return <p>Chargement...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard Partenaire</h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-2 flex items-center">
          <FaUserTie className="mr-2 text-blue-600" /> {partner.name}
        </h3>
        <p className="text-gray-600">{partner.email}</p>
        <p className={`mt-2 inline-block px-2 py-1 rounded text-sm ${
          partner.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}>
          {partner.status}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Clics</p>
          <p className="text-xl font-bold">{stats.clicks}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Leads</p>
          <p className="text-xl font-bold">{stats.leads}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Conversions</p>
          <p className="text-xl font-bold">{stats.conversions}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Commissions</p>
          <p className="text-xl font-bold flex items-center justify-center">
            <FaCoins className="mr-2 text-yellow-500" /> {stats.commissions} €
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="font-semibold mb-2 flex items-center">
          <FaLink className="mr-2 text-orange-600" /> Mon lien affilié
        </h3>
        <p className="text-gray-600">
          {process.env.NEXT_PUBLIC_APP_URL}/auth/register?ref={partner.affiliateCode}
        </p>
      </div>
    </div>
  );
}

