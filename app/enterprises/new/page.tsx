"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function NewEnterprisePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    logo: "",
    directors: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/enterprises", form);
      router.push("/enterprises");
    } catch (err: any) {
      console.error("Erreur création entreprise", err);
      setError("Impossible de créer l’entreprise. Vérifiez les champs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        Nouvelle entreprise
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 max-w-xl space-y-4"
      >
        {error && <p className="text-red-600">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de l’entreprise
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Logo (URL)
          </label>
          <input
            type="text"
            name="logo"
            value={form.logo}
            onChange={handleChange}
            placeholder="https://..."
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du ou des dirigeants
          </label>
          <input
            type="text"
            name="directors"
            value={form.directors}
            onChange={handleChange}
            placeholder="Jean Dupont, Marie Diallo"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Création…" : "Créer l’entreprise"}
        </button>
      </form>
    </main>
  );
}

