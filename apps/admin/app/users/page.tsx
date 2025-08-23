'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { cardClasses, buttonClasses } from '@/components/ui';

type User = {
  id: string;
  name?: string | null;
  email: string;
  role?: string;                // PLATFORM_ADMIN / TENANT_ADMIN / MANAGER / STAFF
  enterprise_id?: string | null;
  enterprise?: { id: string; name: string } | null; // si ton API hydrate
  createdAt?: string;
};

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const limit = 20;

  const hasItems = useMemo(() => items && items.length > 0, [items]);

  async function load(p = 1) {
    setLoading(true);
    setErr(null);
    try {
      // essaie GET /api/users?page=X&limit=Y&q=...
      const { data } = await api.get('/api/users', { params: { page: p, limit, q: q || undefined } });
      // tolère plusieurs formats de réponse
      const list: User[] = Array.isArray(data)
        ? data
        : (data?.items ?? data?.users ?? []);
      setItems(list || []);
      setTotal(data?.total ?? null);
      setPage(p);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1); /* on mount */ }, []);
  useEffect(() => { const t = setTimeout(()=>load(1), 350); return ()=>clearTimeout(t); }, [q]); // debounce search

  const canPrev = page > 1;
  const canNext = total ? page * limit < total : items.length === limit; // best effort

  return (
    <div className="grid gap-4">
      <div className={cardClasses('flex items-center justify-between')}>
        <div>
          <h1 className="text-xl font-semibold">Utilisateurs</h1>
          <p className="text-mutedText text-sm">
            Vue globale plateforme (lecture seule)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Rechercher (nom, email)"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand w-64"
          />
        </div>
      </div>

      <div className={cardClasses()}>
        {loading && <div className="text-mutedText">Chargement…</div>}
        {err && <div className="text-red-400">{err}</div>}
        {!loading && !hasItems && !err && <div className="text-mutedText">Aucun résultat</div>}

        {!loading && hasItems && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-mutedText">
                  <tr className="border-b border-[rgba(255,255,255,0.08)]">
                    <th className="py-2 pr-3">Nom</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Rôle</th>
                    <th className="py-2 pr-3">Entreprise</th>
                    <th className="py-2 pr-3">Créé</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(u => (
                    <tr key={u.id} className="border-b border-[rgba(255,255,255,0.06)] last:border-0">
                      <td className="py-2 pr-3">{u.name || '—'}</td>
                      <td className="py-2 pr-3">{u.email}</td>
                      <td className="py-2 pr-3">{u.role || '—'}</td>
                      <td className="py-2 pr-3">
                        {u.enterprise?.name || u.enterprise_id || '—'}
                      </td>
                      <td className="py-2 pr-3">
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="text-xs text-mutedText">
                Page {page}{total ? ` — ~${total} users` : ''}
              </div>
              <div className="flex gap-2">
                <button className={buttonClasses('ghost','px-3 py-1')}
                        disabled={!canPrev}
                        onClick={()=>canPrev && load(page-1)}>
                  Précédent
                </button>
                <button className={buttonClasses('ghost','px-3 py-1')}
                        disabled={!canNext}
                        onClick={()=>canNext && load(page+1)}>
                  Suivant
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

