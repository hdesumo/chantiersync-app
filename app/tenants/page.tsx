// app/tenants/page.tsx
"use client";

import { useEffect, useState } from "react";
import { serverApiFetch } from "@/lib/api";

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTenants() {
      try {
        const data = await serverApiFetch<Tenant[]>("/tenants");
        setTenants(data);
      } catch (err) {
        console.error("Erreur lors du chargement des tenants", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTenants();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenants</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Slug</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td className="border px-4 py-2">{t.id}</td>
              <td className="border px-4 py-2">{t.name}</td>
              <td className="border px-4 py-2">{t.slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
