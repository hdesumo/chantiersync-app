// app/sites/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { listSites, createSite, siteQrPngUrl, type Site, type ListSitesParams } from '@/lib/api';

type CreateState = { name: string; code: string; location: string; };

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

const SORTABLE: Array<{ key: NonNullable<ListSitesParams['sortBy']>, label: string }> = [
  { key: 'name',      label: 'Nom' },
  { key: 'code',      label: 'Code' },
  { key: 'status',    label: 'Statut' },
  { key: 'createdAt', label: 'Créé le' },
  { key: 'updatedAt', label: 'Maj le' },
];

export default function SitesPage() {
  const { token, logout } = useAuth();

  // params serveur
  const [q, setQ] = useState('');
  const dq = useDebounced(q, 350);
  const [status, setStatus] = useState<'' | 'active' | 'archived'>('');
  const [from, setFrom] = useState<string>(''); // YYYY-MM-DD
  const [to, setTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<NonNullable<ListSitesParams['sortBy']>>('createdAt');
  const [sortDir, setSortDir] = useState<NonNullable<ListSitesParams['sortDir']>>('desc');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  // data
  const [rows, setRows] = useState<Site[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // creation
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [form, setForm] = useState<CreateState>({ name: '', code: '', location: '' });

  // qr modal
  const [qrId, setQrId] = useState<string | null>(null);

  const hasPrev = offset > 0;
  const hasNext = offset + limit < count;

  const params = useMemo<ListSitesParams>(() => ({
    q: dq.trim() || undefined,
    status: status || undefined,
    from: from || undefined,
    to: to || undefined,
    sortBy, sortDir, limit, offset,
  }), [dq, status, from, to, sortBy, sortDir, limit, offset]);

  async function fetchData(tok: string, p: ListSitesParams) {
    setLoading(true); setErr(null);
    try {
      const data = await listSites(tok, p);
      setRows(data.rows || []);
      setCount(data.count || 0);
    } catch (e: any) {
      setErr(e?.message ?? 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    fetchData(token, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, params.q, params.status, params.from, params.to, params.sortBy, params.sortDir, params.limit, params.offset]);

  function toggleSort(col: NonNullable<ListSitesParams['sortBy']>) {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  }

  async function onCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setCreateErr(null);
    if (!form.name.trim()) {
      setCreateErr('Le nom est requis');
      return;
    }
    setCreating(true);
    try {
      await createSite(token, {
        name: form.name.trim(),
        code: form.code.trim() || undefined,
        location: form.location.trim() || undefined,
      });
      setOpenCreate(false);
      setForm({ name: '', code: '', location: '' });
      setOffset(0);
      await fetchData(token, { ...params, offset: 0 });
    } catch (e: any) {
      const msg = String(e?.message || 'Création impossible');
      setCreateErr(msg.includes('404') ? 'POST /api/sites inexistant côté API' : msg);
    } finally {
      setCreating(false);
    }
  }

  if (!token) return <div className="p-6">Non authentifié — merci de vous connecter.</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sites</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenCreate(true)} className="rounded-lg bg-black text-white px-3 py-1.5 hover:opacity-95">
            + Nouveau
          </button>
          <button onClick={logout} className="rounded-lg border px-3 py-1.5">
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Toolbar: recherche + filtres */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOffset(0); }}
            placeholder="Rechercher (nom, code)…"
            className="w-64 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <span>Statut</span>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as any); setOffset(0); }}
              className="rounded border px-2 py-1"
            >
              <option value="">Tous</option>
              <option value="active">Actif</option>
              <option value="archived">Archivé</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <span>Du</span>
            <input
              type="date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setOffset(0); }}
              className="rounded border px-2 py-1"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <span>Au</span>
            <input
              type="date"
              value={to}
              onChange={(e) => { setTo(e.target.value); setOffset(0); }}
              className="rounded border px-2 py-1"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Total: {count}</span>
          <label className="inline-flex items-center gap-2">
            <span>par page</span>
            <select
              className="rounded border px-2 py-1"
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setOffset(0); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left [&>th]:font-medium text-gray-700">
              {SORTABLE.map(col => (
                <th key={col.key}>
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span aria-hidden className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
              ))}
              <th className="px-3 py-2 text-left font-medium">Localisation</th>
              <th className="px-3 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!loading && rows.length === 0 && (
              <tr><td colSpan={SORTABLE.length + 2} className="px-3 py-6 text-center text-gray-500">Aucune donnée</td></tr>
            )}
            {rows.map((s) => (
              <tr key={s.id} className="[&>td]:px-3 [&>td]:py-2">
                <td>{s.name}</td>
                <td>{s.code || <span className="italic text-gray-400">—</span>}</td>
                <td>
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700">
                    {s.status || 'active'}
                  </span>
                </td>
                <td>{s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}</td>
                <td>{s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—'}</td>
                <td>{s.location || <span className="italic text-gray-400">—</span>}</td>
                <td className="flex items-center gap-2">
                  <button onClick={() => setQrId(s.id)} className="rounded border px-2 py-1">Voir QR</button>
                  <a href={siteQrPngUrl(s.id, 512)} download={`site-${s.id}.png`} className="rounded border px-2 py-1">
                    Télécharger
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => hasPrev && setOffset(Math.max(0, offset - limit))}
                disabled={!hasPrev || loading}
                className="rounded border px-3 py-1.5 disabled:opacity-50">← Précédent</button>
        <div className="text-sm text-gray-600">
          {Math.floor(offset / limit) + 1} / {Math.max(1, Math.ceil(count / limit))}
        </div>
        <button onClick={() => hasNext && setOffset(offset + limit)}
                disabled={!hasNext || loading}
                className="rounded border px-3 py-1.5 disabled:opacity-50">Suivant →</button>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nouveau site</h2>
              <button onClick={() => setOpenCreate(false)} className="rounded border px-2 py-1 text-sm">Fermer</button>
            </div>
            {createErr && (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {createErr}
              </div>
            )}
            <form onSubmit={onCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Nom *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Ex. Chantier A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Code</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Ex. DEMO-002"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Localisation</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Ex. Douala"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setOpenCreate(false)} className="rounded border px-3 py-1.5">
                  Annuler
                </button>
                <button type="submit" disabled={creating} className="rounded bg-black text-white px-3 py-1.5 disabled:opacity-50">
                  {creating ? 'Création…' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setQrId(null)}>
          <div className="max-w-full rounded-2xl bg-white p-4 shadow" onClick={(e) => e.stopPropagation()}>
            <img src={siteQrPngUrl(qrId, 512)} alt="QR" className="mx-auto" width={512} height={512} />
            <div className="mt-3 text-center">
              <button onClick={() => setQrId(null)} className="rounded border px-3 py-1.5">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

