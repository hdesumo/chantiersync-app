'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { listUsers, type User } from '@/lib/api';

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    const res = await listUsers({ token, page: 1, limit: 20 });
    if (!res.ok) setErr(res.error || 'Erreur');
    else setUsers(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Utilisateurs</h1>
      {loading && <p>Chargement…</p>}
      {err && <p className="text-red-400">{err}</p>}
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u.id} className="rounded-lg border border-white/10 p-3">
            <div className="font-medium">{u.name || u.email}</div>
            <div className="text-xs opacity-70">{u.role}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

