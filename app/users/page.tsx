'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { buttonClasses, cardClasses } from '@/components/ui';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  enterprise_id?: string | null;
  createdAt?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // filtres simples
  const [p, setP] = useState(1);
  const [limit, setLimit] = useState(10);
  const [q, setQ] = useState('');

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || undefined
      : undefined;

  async function loadUsers() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      if (p) qs.set('page', String(p));
      if (limit) qs.set('limit', String(limit));
      if (q) qs.set('q', q);

      const path = qs.toString() ? `/api/users?${qs.toString()}` : '/api/users';
      const { data } = await api.get<User[]>(path, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // tolère plusieurs formats de réponse
      const list: User[] = Array.isArray(data)
        ? data
        : (data as any)?.items ?? [];

      setUsers(list);
    } catch (e: any) {
      setErr(e?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, p, limit]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setP(1);
    loadUsers();
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs (plateforme)</h1>
          <p className="text-mutedText">Liste globale (rôle PLATFORM_ADMIN requis)</p>
        </div>
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche (nom, email)"
            className="border rounded-md px-3 py-2"
          />
          <button className={buttonClasses()} type="submit">
            Rechercher
          </button>
        </form>
      </div>

      {loading && <p>Chargement…</p>}
      {err && <p className="text-red-600">{err}</p>}

      <div className="grid gap-3">
        {users.map((u) => (
          <div key={u.id} className={cardClasses('p-4')}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <div className="text-xs px-2 py-1 rounded bg-gray-100">{u.role}</div>
            </div>
          </div>
        ))}
      </div>

      {!loading && users.length === 0 && !err && (
        <p className="text-gray-500 mt-6">Aucun utilisateur.</p>
      )}

      <div className="flex items-center gap-3 mt-6">
        <button
          className={buttonClasses('disabled:opacity-50')}
          onClick={() => setP((x) => Math.max(1, x - 1))}
          disabled={p <= 1 || loading}
        >
          ← Précédent
        </button>
        <span className="text-sm">Page {p}</span>
        <button
          className={buttonClasses('disabled:opacity-50')}
          onClick={() => setP((x) => x + 1)}
          disabled={loading || users.length < limit}
        >
          Suivant →
        </button>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="ml-4 border rounded px-2 py-1 text-sm"
          disabled={loading}
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
