'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { cardClasses, buttonClasses } from '@/components/ui';

type Tenant = {
  id: string;
  name: string;
  slug?: string | null;
  domain?: string | null;
  suspended?: boolean;
  createdAt?: string;
};

export default function TenantsPage() {
  const [items, setItems] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // formulaire création
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  const hasItems = useMemo(() => items && items.length > 0, [items]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // GET /api/tenants  → attendu: { items: Tenant[] } ou Tenant[]
      const { data } = await api.get('/api/tenants');
      const list: Tenant[] = Array.isArray(data) ? data : (data?.items ?? []);
      setItems(list);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      // POST /api/tenants  → { name, domain? }
      await api.post('/api/tenants', { name, domain: domain || undefined });
      setName('');
      setDomain('');
      setOpenCreate(false);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || 'Création impossible');
    }
  }

  async function toggleSuspend(t: Tenant) {
    setErr(null);
    try {
      // PATCH /api/tenants/:id  → { suspended: boolean }
      await api.patch(`/api/tenants/${t.id}`, { suspended: !t.suspended });
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || 'Action impossible');
    }
  }

  return (
    <div className="grid gap-4">
      {/* Header + bouton créer */}
      <div className={cardClasses('flex items-center justify-between')}>
        <div>
          <h1 className="text-xl font-semibold">Tenants</h1>
          <p className="text-mutedText text-sm">Entreprises clientes (multi-tenant)</p>
        </div>
        <button
          className={buttonClasses('primary')}
          onClick={() => setOpenCreate((v) => !v)}
        >
          Nouveau tenant
        </button>
      </div>

      {/* Formulaire création */}
      {openCreate && (
        <div className={cardClasses('')}>
          <form onSubmit={onCreate} className="grid gap-3 max-w-xl">
            <div className="grid gap-1">
              <label className="text-sm text-mutedText">Nom de l’entreprise</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand"
                placeholder="Ex: Atelier Dubois"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-mutedText">
                Domaine (optionnel, ex: <span className="opacity-80">dubois.fr</span>)
              </label>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand"
                placeholder="dubois.fr"
              />
            </div>

            <div className="flex gap-2">
              <button className={buttonClasses('primary')} type="submit">
                Créer
              </button>
              <button
                type="button"
                className={buttonClasses('ghost')}
                onClick={() => setOpenCreate(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      <div className={cardClasses('')}>
        {loading && <div className="text-mutedText">Chargement…</div>}
        {err && <div className="text-red-400">{err}</div>}

        {!loading && !hasItems && !err && (
          <div className="text-mutedText">Aucun tenant pour le moment.</div>
        )}

        {!loading && hasItems && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-mutedText">
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="py-2 pr-3">Nom</th>
                  <th className="py-2 pr-3">Slug</th>
                  <th className="py-2 pr-3">Domaine</th>
                  <th className="py-2 pr-3">Statut</th>
                  <th className="py-2 pr-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[rgba(255,255,255,0.06)] last:border-0"
                  >
                    <td className="py-2 pr-3">{t.name}</td>
                    <td className="py-2 pr-3">{t.slug || '—'}</td>
                    <td className="py-2 pr-3">{t.domain || '—'}</td>
                    <td className="py-2 pr-3">
                      {t.suspended ? (
                        <span className="text-red-300">suspendu</span>
                      ) : (
                        <span className="text-green-300">actif</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex gap-2">
                        <button
                          className={buttonClasses(
                            t.suspended ? 'primary' : 'ghost',
                            'px-3 py-1'
                          )}
                          onClick={() => toggleSuspend(t)}
                          title={t.suspended ? 'Réactiver' : 'Suspendre'}
                        >
                          {t.suspended ? 'Réactiver' : 'Suspendre'}
                        </button>
                        {/* placeholder: voir détail */}
                        <button
                          className={buttonClasses('subtle', 'px-3 py-1')}
                          onClick={() => alert('TODO: détails du tenant')}
                        >
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

