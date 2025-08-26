"use client";

import { useState } from "react";
import { clientGet, clientDelete } from "@/lib/clientApi";

type Site = { id: number; name: string; city?: string };

export default function SitesTable({ initialItems }: { initialItems: Site[] }) {
  const [items, setItems] = useState<Site[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await clientGet<{ items: Site[] }>("api/sites?limit=20");
      setItems(data.items);
    } catch (e: any) {
      setErr(e?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer ce chantier ?")) return;
    await clientDelete(`api/sites/${id}`);
    await refresh();
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <button onClick={refresh} className="px-3 py-2 rounded bg-black text-white">
          Rafraîchir
        </button>
        {loading && <span>Chargement…</span>}
        {err && <span className="text-red-600">{err}</span>}
      </div>

      <ul className="divide-y rounded border">
        {items.map((s) => (
          <li key={s.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm opacity-70">{s.city}</div>
            </div>
            <button onClick={() => remove(s.id)} className="text-red-600">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

