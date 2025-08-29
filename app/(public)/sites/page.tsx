'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { createSite, listSites, siteQrPngUrl, type Site } from '@/lib/api';

export default function SitesPage() {
  const { token } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    const res = await listSites(token);
    if (!res.ok) setErr(res.error || 'Erreur');
    else setSites(res.data || []);
    setLoading(false);
  };

  const onCreate = async () => {
    if (!token) return;
    const name = prompt('Nom du chantier ?');
    if (!name) return;
    const res = await createSite({ name }, token);
    if (!res.ok) alert(res.error || 'Erreur création');
    else load();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Chantiers</h1>
        <button
          onClick={onCreate}
          className="px-3 py-2 rounded-lg bg-[#0f172a] border border-white/10"
        >
          Nouveau chantier
        </button>
      </div>

      {loading && <p>Chargement…</p>}
      {err && <p className="text-red-400">{err}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((s) => (
          <div key={s.id} className="rounded-xl border border-white/10 p-4">
            <div className="font-medium mb-2">{s.name}</div>
            <img
              alt="QR site"
              src={siteQrPngUrl(s.id)}
              className="w-28 h-28 bg-black/20 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

