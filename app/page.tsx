'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { buttonClasses, cardClasses } from '@/components/ui';

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Garde d'auth: si pas connecté → /login
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="p-6">
        <p className="opacity-70">Chargement…</p>
      </main>
    );
  }

  if (!user) {
    // On laisse la redirection s’effectuer
    return null;
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Console plateforme — Chantiersync</h1>
        <button
          onClick={() => {
            logout();
            router.replace('/login');
          }}
          className={buttonClasses()}
        >
          Se déconnecter
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <a href="/users" className={cardClasses('hover:bg-white/[0.04] transition')}>
          <div className="text-lg font-medium">Utilisateurs</div>
          <p className="text-sm opacity-70">Gérer les comptes de la plateforme</p>
        </a>

        <a href="/sites" className={cardClasses('hover:bg-white/[0.04] transition')}>
          <div className="text-lg font-medium">Chantiers</div>
          <p className="text-sm opacity-70">Lister et créer des chantiers</p>
        </a>
      </div>
    </main>
  );
}

