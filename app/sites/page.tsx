// app/sites/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import {
  listSites,
  createSite,
  siteQrPngUrl,
  type Site,
  type ListSitesParams,
} from '@/lib/api';
import AuthorizedImage from '@/components/AuthorizedImage';// app/sites/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import {
  listSites,
  createSite,
  siteQrPngUrl,
  type Site,
  type ListSitesParams,
} from '@/lib/api';
import AuthorizedImage from '@/components/AuthorizedImage';

type SortBy = NonNullable<ListSitesParams['sortBy']>;
type SortDir = NonNullable<ListSitesParams['sortDir']>;
type CreateState = { name: string; code: string; location: string };

// Feature flag pour la création
const ENABLE_CREATE = process.env.NEXT_PUBLIC_ENABLE_CREATE_SITES === '1';

// petit hook debounce pour la recherche
function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function SitesPage() {
  const { token } = useAuth();

  // filtres/tri/pagination
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const qDebounced = useDebounced(q, 300);

  // data
  const [rows, setRows] = useState<Site[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // création
  const [openCreate, setOpenCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [form, setForm] = useState<CreateState>({ name: '', code: '', location: '' });

  // QR modal
  const [qrId, setQrId] = useState<string | null>(null);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(count / Math.max(1, limit))),
    [count, limit]
  );

  // fetch serveur
  useEffect(() => {
    if (!token) return;
    let ignore = false;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await listSites(token, {
          q: qDebounced || undefined,
          status: status || undefined,
          from: from || undefined,
          to: to || undefined,
          sortBy,
          sortDir,
          limit,
          offset,
        });
        if (!ignore) {
          setRows(res.rows);
          setCount(res.count);
        }
      } catch (e: any) {
        if (!ignore) setErr(String(e?.message || 'chargement impossible'));
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [token, qDebounced, status, from, to, sortBy, sortDir, limit, offset]);

  function toggleSort(col: SortBy) {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setOffset(0);
  }

  function resetFilters() {
    setQ('');
    setStatus('');
    setFrom('');
    setTo('');
    setSortBy('createdAt');
    setSortDir('desc');
    setLimit(10);
    setOffset(0);
  }

  function gotoPage(p: number) {
    const pSafe = Math.min(Math.max(1, p), totalPages);
    setOffset((pSafe - 1) * limit);
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    setCreateErr(null);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim() || undefined,
        location: form.location.trim() || undefined,
      };
      if (!payload.name) {
        setCreateErr('Le nom est requis.');
      } else {
        await createSite(token, payload);
        setOpenCreate(false);
        setForm({ name: '', code: '', location: '' });
        // recharger la première page pour voir le nouvel item
        setOffset(0);
        const res = await listSites(token, {
          q: qDebounced || undefined,
          status: status || undefined,
          from: from || undefined,
          to: to || undefined,
          sortBy,
          sortDir,
          limit,
          offset: 0,
        });
        setRows(res.rows);
        setCount(res.count);
      }
    } catch (e: any) {
      setCreateErr(String(e?.message || 'création impossible'));
    } finally {
      setCreating(false);
    }
  }

  if (!token) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Sites</h1>
        <p className="text-sm text-gray-600">
          Non authentifié – <a className="underline" href="/login">connectez-vous</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold">Sites</h1>
        <div className="flex items-center gap-2">
          {ENABLE_CREATE && (
            <button
              onClick={() => setOpenCreate(true)}
              className="rounded-lg bg-black text-white px-3 py-1.5 hover:opacity-95"
            >
              + Nouveau
            </button>
          )}
          <div className="text-sm text-gray-500">
            {loading ? 'Chargement…' : `${count} résultat${count > 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOffset(0); }}
          placeholder="Rechercher (nom ou code)…"
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setOffset(0); }}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
        >
          <option value="">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="archived">Archivé</option>
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => { setFrom(e.target.value); setOffset(0); }}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => { setTo(e.target.value); setOffset(0); }}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10"
        />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Par page</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(parseInt(e.target.value, 10) || 10); setOffset(0); }}
            className="rounded-lg border border-gray-300 px-2 py-1"
          >
            {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="text-sm rounded-lg border px-3 py-2 hover:bg-gray-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th label="Code"    col="code"      sortBy={sortBy} sortDir={sortDir} onClick={toggleSort}/>
              <Th label="Nom"     col="name"      sortBy={sortBy} sortDir={sortDir} onClick={toggleSort}/>
              <Th label="Statut"  col="status"    sortBy={sortBy} sortDir={sortDir} onClick={toggleSort}/>
              <Th label="Créé le" col="createdAt" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort}/>
              <Th label="Maj le"  col="updatedAt" sortBy={sortBy} sortDir={sortDir} onClick={toggleSort}/>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {err && (
              <tr>
                <td colSpan={6} className="p-4 text-red-600">{err}</td>
              </tr>
            )}
            {!err && rows.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="p-4 text-gray-500">Aucun résultat.</td>
              </tr>
            )}
            {rows.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.code || '—'}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.status || '—'}</td>
                <td className="p-3">{formatDate(s.createdAt)}</td>
                <td className="p-3">{formatDate(s.updatedAt)}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQrId(s.id)}
                      className="rounded border px-2 py-1 hover:bg-gray-50"
                      title="Voir le QR"
                    >
                      QR
                    </button>
                    {/* TODO: bouton Éditer, Archiver, etc. */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page}/{totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => gotoPage(page - 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-50"
          >
            ← Précédent
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => gotoPage(page + 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-50"
          >
            Suivant →
          </button>
        </div>
      </div>

      {/* Modal création */}
      {ENABLE_CREATE && openCreate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Nouveau site</h2>
              <button onClick={() => setOpenCreate(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            {createErr && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {createErr}
              </div>
            )}
            <form onSubmit={submitCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Nom*</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-900/10 outline-none"
                  placeholder="Site Démo"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Code</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-900/10 outline-none"
                    placeholder="DEMO-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Localisation</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-900/10 outline-none"
                    placeholder="Douala"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="rounded-lg border px-3 py-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-black text-white px-3 py-2 disabled:opacity-50"
                >
                  {creating ? 'Création…' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR */}
      {qrId && token && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setQrId(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">QR du site</h2>
              <button onClick={() => setQrId(null)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <div className="flex items-center justify-center">
              {/* Utilise AuthorizedImage pour injecter Authorization: Bearer */}
              <AuthorizedImage
                src={siteQrPngUrl(qrId, 512).replace(/^https?:\/\/[^/]+/, '')} // chemin relatif pour AuthorizedImage
                token={token}
                alt="QR code"
                width={256}
                height={256}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({
  label, col, sortBy, sortDir, onClick,
}: { label: string; col: SortBy; sortBy: SortBy; sortDir: SortDir; onClick: (c: SortBy) => void }) {
  const active = sortBy === col;
  return (
    <th
      className="text-left p-3 font-medium cursor-pointer select-none"
      onClick={() => onClick(col)}
      title={`Trier par ${label}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="text-gray-400 text-xs">
          {active ? (sortDir === 'asc' ? '▲' : '▼') : '△'}
        </span>
      </span>
    </th>
  );
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso as string;
  }
}
