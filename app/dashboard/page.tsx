"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    sites: 0,
    reports: 0,
    users: 0,
    enterprises: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const [sitesRes, reportsRes, usersRes, enterprisesRes] =
          await Promise.all([
            api.get("/sites"),
            api.get("/reports"),
            api.get("/users"),
            api.get("/enterprises"),
          ]);

        setStats({
          sites: sitesRes.data?.length || 0,
          reports: reportsRes.data?.length || 0,
          users: usersRes.data?.length || 0,
          enterprises: enterprisesRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Erreur dashboard SuperAdmin", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        Tableau de bord (SuperAdmin)
      </h1>

      {loading ? (
        <p className="text-gray-600">Chargement…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-xl p-6 text-center border-t-4 border-blue-600">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Chantiers</h2>
            <p className="text-4xl font-extrabold text-blue-600">{stats.sites}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center border-t-4 border-green-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Rapports</h2>
            <p className="text-4xl font-extrabold text-green-600">{stats.reports}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center border-t-4 border-purple-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Utilisateurs</h2>
            <p className="text-4xl font-extrabold text-purple-600">{stats.users}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center border-t-4 border-orange-500">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Entreprises</h2>
            <p className="text-4xl font-extrabold text-orange-600">{stats.enterprises}</p>
          </div>
        </div>
      )}
    </main>
  );
}

