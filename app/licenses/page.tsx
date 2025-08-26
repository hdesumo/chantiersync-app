"use client";

import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthProvider";

interface License {
  id?: string;
  enterprise_id: string;
  enterprise?: { id: string; name: string };
  type: string;
  start_date: string;
  end_date: string;
  max_users: number;
  status: string;
}

export default function LicensesPage() {
  const { token } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  // 👉 gestion modale
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<License | null>(null);
  const [formData, setFormData] = useState<License>({
    enterprise_id: "",
    type: "ANNUAL",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toISOString().split("T")[0],
    max_users: 10,
    status: "active",
  });

  const fetchLicenses = async () => {
    try {
      const res = await api.get("/licenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLicenses(res.data);
    } catch (err) {
      console.error("Erreur fetch licenses", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLicense = async (id: string) => {
    if (!confirm("Supprimer cette licence ?")) return;
    try {
      await api.delete(`/licenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLicenses();
    } catch (err) {
      console.error("Erreur suppression licence", err);
    }
  };

  const openModal = (license?: License) => {
    if (license) {
      setEditing(license);
      setFormData({
        ...license,
        start_date: license.start_date.split("T")[0],
        end_date: license.end_date.split("T")[0],
      });
    } else {
      setEditing(null);
      setFormData({
        enterprise_id: "",
        type: "ANNUAL",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString().split("T")[0],
        max_users: 10,
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/licenses/${editing.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/licenses", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      fetchLicenses();
    } catch (err) {
      console.error("Erreur sauvegarde licence", err);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Gestion des Licences
      </h1>

      {loading ? (
        <p className="text-gray-600">Chargement...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-left">Entreprise</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Début</th>
                <th className="px-4 py-2">Expiration</th>
                <th className="px-4 py-2">Max Users</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((l) => (
                <tr key={l.id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2">{l.enterprise?.name}</td>
                  <td className="px-4 py-2">{l.type}</td>
                  <td className="px-4 py-2">
                    {new Date(l.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(l.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{l.max_users}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        l.status === "active"
                          ? "bg-green-600"
                          : l.status === "expired"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => openModal(l)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => deleteLicense(l.id!)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {licenses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                    Aucune licence pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Créer une Licence
        </button>
      </div>

      {/* Modale */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              {editing ? "Modifier la Licence" : "Créer une Licence"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enterprise ID"
                value={formData.enterprise_id}
                onChange={(e) =>
                  setFormData({ ...formData, enterprise_id: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="ANNUAL">ANNUAL</option>
                <option value="MONTHLY">MONTHLY</option>
                <option value="TRIAL">TRIAL</option>
              </select>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
              </div>
              <input
                type="number"
                placeholder="Max Users"
                value={formData.max_users}
                onChange={(e) =>
                  setFormData({ ...formData, max_users: Number(e.target.value) })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editing ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

