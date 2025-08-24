'use client';

import { useEffect, useState } from 'react';
import api, { type Site, siteQrPngUrl, createSite, listSites } from '@/lib/api';
import AuthorizedImage from '@/components/AuthorizedImage';
import { buttonClasses, cardClasses } from '@/components/ui';

// ✅ Type local (on n’importe plus ListSitesParams depuis lib/api)
type ListSitesParams = {
  token?: string;
  page?: number;
  pageSize?: number;
  q?: string;
  order?: string;
};

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || undefined
      : undefined;

  async function loadSites() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const { data } = await listSites({ token } as ListSitesParams);
      setSites(data);
    } catch (e: any) {
      setErr(e.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }

  async function onCreate() {
    if (!token) return;
    const name = prompt('Nom du chantier ?');
    if (!name) return;
    try {
      await createSite({ name }, token);
      await loadSites();
    } catch (e: any) {
      alert('Erreur création: ' + e.message);
    }
  }

  useEffect(() => {
    loadSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chantiers</h1>
        <button onClick={onCreate} className={buttonClasses()}>
          + Nouveau chantier
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {err && <p className="text-red-600">{err}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((s) => (
          <div key={s.id} className={cardClasses('p-4')}>
            <h2 className="font-semibold">{s.name}</h2>
            {s.address && <p className="text-sm text-gray-500">{s.address}</p>}
            <div className="mt-2">
              <AuthorizedImage
                src={siteQrPngUrl(s.id)}
                alt={`QR ${s.name}`}
                className="w-32 h-32"
              />
            </div>
          </div>
        ))}
      </div>

      {!loading && sites.length === 0 && (
        <p className="text-gray-500">Aucun chantier trouvé.</p>
      )}
    </div>
  );
}

