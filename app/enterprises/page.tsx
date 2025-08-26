"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function EnterprisesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [enterprises, setEnterprises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchEnterprises = async () => {
      try {
        const res = await api.get("/enterprises");
        setEnterprises(res.data || []);
      } catch (err) {
        console.error("Erreur chargement entreprises", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        Gestion des entreprises
      </h1>

      {loading ? (
        <p className="text-gray-600">Chargement…</p>
      ) : enterprises.length === 0 ? (
        <p className="text-gray-500">Aucune entreprise inscrite pour le moment.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-600 text-white text-left">
              <tr>
                <th className="px-6 py-3">Entreprise</th>
                <th className="px-6 py-3">Sites</th>
                <th className="px-6 py-3">Utilisateurs</th>
                <th className="px-6 py-3">Rapports</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enterprises.map((ent) => (
                <tr key={ent.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{ent.name}</td>
                  <td className="px-6 py-4">{ent.sitesCount ?? 0}</td>
                  <td className="px-6 py-4">{ent.usersCount ?? 0}</td>
                  <td className="px-6 py-4">{ent.reportsCount ?? 0}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Voir
                    </button>
                    <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      Suspendre
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

