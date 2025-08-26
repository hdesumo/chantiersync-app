"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  location?: string;
  siteId: string;
  createdAt: string;
};

type Site = {
  id: string;
  name: string;
};

export default function ReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulaire
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "incident",
    priority: "medium",
    siteId: "",
  });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [repRes, siteRes] = await Promise.all([
          api.get("/reports"),
          api.get("/sites"),
        ]);
        setReports(repRes.data || []);
        setSites(siteRes.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
        setError("Impossible de charger les rapports");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/reports", form);
      setReports([res.data, ...reports]);
      setForm({
        title: "",
        description: "",
        category: "incident",
        priority: "medium",
        siteId: "",
      });
    } catch (err) {
      console.error("Erreur lors de la création du rapport", err);
      setError("Impossible de créer le rapport");
    }
  };

  if (!user) return null;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rapports</h1>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-4 mb-6 max-w-2xl space-y-3"
      >
        <h2 className="text-lg font-semibold">Nouveau rapport</h2>
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-3">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="flex-1 border p-2 rounded"
          >
            <option value="incident">Incident</option>
            <option value="progress">Avancement</option>
            <option value="quality">Qualité</option>
            <option value="safety">Sécurité</option>
          </select>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="flex-1 border p-2 rounded"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
        <select
          name="siteId"
          value={form.siteId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">-- Sélectionner un site --</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>

      {/* Liste */}
      {loading && <p>Chargement des rapports…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Titre</th>
              <th className="border px-4 py-2 text-left">Catégorie</th>
              <th className="border px-4 py-2 text-left">Priorité</th>
              <th className="border px-4 py-2 text-left">Site</th>
              <th className="border px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((r) => (
                <tr key={r.id}>
                  <td className="border px-4 py-2">{r.title}</td>
                  <td className="border px-4 py-2">{r.category}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        r.priority === "high"
                          ? "bg-red-500"
                          : r.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {r.priority}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {sites.find((s) => s.id === r.siteId)?.name || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border px-4 py-2 text-center">
                  Aucun rapport
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}
