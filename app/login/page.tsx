'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { buttonClasses, cardClasses } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@demo.local');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/'); // go home après succès
    } catch (e: any) {
      setErr(e?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center min-h-[70vh] p-6">
      <div className={cardClasses('w-full max-w-md')}>
        <h1 className="text-2xl mb-2">Connexion</h1>
        <p className="text-mutedText mb-4">Console plateforme</p>

        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm opacity-80">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button type="submit" disabled={loading} className={buttonClasses('w-full')}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

