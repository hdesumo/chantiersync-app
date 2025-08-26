"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type User = {
  id: string;
  email: string;
  role: string;
  full_mobile?: string;
  enterprise_id?: string;
  createdAt: string;
};

type Enterprise = {
  id: string;
  name: string;
};

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulaire
  const [form, setForm] = useState({
    email: "",
    role: "TENANT_ADMIN",
    full_mobile: "",
    pin: "",
    enterprise_id: "",
  });

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, enterprisesRes] = await Promise.all([
          api.get("/users"),
          api.get("/enterprises"),
        ]);
        setUsers(usersRes.data || []);
        setEnterprises(enterprisesRes.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs", err);
        setError("Impossible de charger les utilisateurs");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/users", form);
      setUsers([res.data, ...users]);
      setForm({
        email: "",
        role: "TENANT_ADMIN",
        full_mobile: "",
        pin: "",
        enterprise_id: "",
      });
    } catch (err) {
      console.error("Erreur lors de la création de l’utilisateur", err);
      setError("Impossible de créer l’utilisateur");
    }
  };

  if (!user) return null;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Utilisateurs</h1>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-4 mb-6 max-w-2xl space-y-3"
      >
        <h2 className="text-lg font-semibold">Nouvel utilisateur</h2>
        <input
          type="email"
          name="email"
          placeholder="email@exemple.com"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="full_mobile"
          placeholder="+221771234567"
          value={form.full_mobile}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="pin"
          placeholder="PIN (4 chiffres)"
          value={form.pin}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="SUPERADMIN">Super Admin</option>
          <option value="PLATFORM_ADMIN">Platform Admin</option>
          <option value="TENANT_ADMIN">Tenant Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="STAFF">Staff</option>
        </select>
        <select
          name="enterprise_id"
          value={form.enterprise_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">-- Sélectionner une entreprise --</option>
          {enterprises.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Créer l’utilisateur
        </button>
      </form>

      {/* Liste */}
      {loading && <p>Chargement des utilisateurs…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Téléphone</th>
              <th className="border px-4 py-2 text-left">Rôle</th>
              <th className="border px-4 py-2 text-left">Entreprise</th>
              <th className="border px-4 py-2 text-left">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2">{u.full_mobile || "-"}</td>
                  <td className="border px-4 py-2">{u.role}</td>
                  <td className="border px-4 py-2">
                    {enterprises.find((e) => e.id === u.enterprise_id)?.name ||
                      "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border px-4 py-2 text-center">
                  Aucun utilisateur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}

