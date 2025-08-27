"use client";

import { useEffect, useState } from "react";
import { FaUserTie, FaCoins, FaLink, FaCopy } from "react-icons/fa";

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

type Lead = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners/dashboard`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PARTNER_TOKEN}`,
          },
        });
        const data = await res.json();
        setPartner(data.partner);
        setStats(data.stats);
        setLeads(data.leads);
      } catch (err) {
        console.error("Erreur API partner dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartnerData();
  }, []);

  const copyLink = () => {
    if (!partner) return;
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?ref=${partner.affiliateCode}`;
    navigator.clipboard.writeText(link);
    alert("Lien copié ✅");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Tableau de bord affilié</h2>

      {loading && <p className="text-gray-500">Chargement...</p>}

      {partner && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 flex items-center">
            <FaUserTie className="text-blue-600 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Affilié</p>
              <p className="text-xl font-bold">{partner.name}</p>
              <p className="text-sm text-gray-500">{partner.email}</p>
              <span
                className={`px-2 py-1 mt-2 inline-block rounded text-sm font-semibold ${
                  partner.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {partner.status}
              </span>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
            <div className="flex items-center mb-4">
              <FaLink className="text-orange-600 text-2xl mr-3" />
              <p className="font-semibold">Lien affilié</p>
            </div>
            <p className="text-gray-600 break-all">
              {process.env.NEXT_PUBLIC_APP_URL}/auth/register?ref={partner.affiliateCode}
            </p>
            <button
              onClick={copyLink}
              className="mt-3 flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaCopy className="mr-2" /> Copier
            </button>
          </div>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Clics</p>
            <p className="text-xl font-bold">{stats.clicks}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Leads</p>
            <p className="text-xl font-bold">{stats.leads}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Conversions</p>
            <p className="text-xl font-bold">{stats.conversions}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">Commissions</p>
            <p className="text-xl font-bold flex items-center justify-center">
              <FaCoins className="mr-2 text-yellow-500" /> {stats.commissions} €
            </p>
          </div>
        </div>
      )}

      <section className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Leads générés</h3>
        {leads.length === 0 ? (
          <p className="text-gray-500">Aucun lead pour l’instant.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Nom</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{l.id}</td>
                  <td className="p-3 border-b">{l.name}</td>
                  <td className="p-3 border-b">{l.email}</td>
                  <td className="p-3 border-b">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

