// app/login/page.tsx
'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type FormState = {
  email: string;
  password: string;
  remember: boolean;
  showPassword: boolean;
};

function validateEmail(email: string) {
  // assez permissif mais utile
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const { token, login } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = useMemo(() => sp.get('from') || '/sites', [sp]);

  const [state, setState] = useState<FormState>({
    email: '',
    password: '',
    remember: true,
    showPassword: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // si déjà loggé → redirect
  useEffect(() => {
    if (token) router.replace(redirectTo);
  }, [token, router, redirectTo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // validations basiques
    if (!validateEmail(state.email)) {
      setError('Email invalide');
      return;
    }
    if (!state.password || state.password.length < 3) {
      setError('Mot de passe trop court');
      return;
    }

    try {
      setSubmitting(true);
      await login(state.email, state.password, state.remember ? 7 : 1);
      router.replace(redirectTo);
    } catch (err: any) {
      // extraire un message lisible
      const msg = String(err?.message || 'Échec de connexion');
      // Certaines erreurs viennent sous forme "HTTP 401 Unauthorized – {...}"
      if (/HTTP\s+\d+/.test(msg)) {
        setError('Identifiants invalides ou accès refusé');
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setState(s => ({ ...s, email: 'admin@demo.local', password: 'admin123' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Connexion</h1>
          <p className="text-sm text-gray-500 mt-1">Espace d’administration Chantiersync</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="vous@exemple.com"
              value={state.email}
              onChange={(e) => setState(s => ({ ...s, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="mt-1 flex gap-2">
              <input
                type={state.showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                placeholder="••••••••"
                value={state.password}
                onChange={(e) => setState(s => ({ ...s, password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setState(s => ({ ...s, showPassword: !s.showPassword }))}
                className="rounded-lg border px-3 text-sm"
                aria-label={state.showPassword ? 'Masquer' : 'Afficher'}
              >
                {state.showPassword ? 'Cacher' : 'Afficher'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={state.remember}
                onChange={(e) => setState(s => ({ ...s, remember: e.target.checked }))}
              />
              Se souvenir de moi
            </label>

            <button
              type="button"
              onClick={fillDemo}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Remplir démo
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-black text-white py-2.5 font-medium hover:opacity-95 disabled:opacity-50"
          >
            {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          API: <code className="px-1 py-0.5 rounded bg-gray-100">
            {process.env.NEXT_PUBLIC_API_BASE || 'NON DÉFINI'}
          </code>
        </div>
      </div>
    </div>
  );
}

