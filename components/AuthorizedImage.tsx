'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  src: string;             // URL absolue côté API (ex: https://api.chantiersync.com/api/sites/:id/qr.png)
  alt?: string;
  className?: string;
  tokenOverride?: string;  // optionnel: passer un token spécifique
  refetchKey?: string | number; // pour forcer le refetch si besoin
};

export default function AuthorizedImage({
  src,
  alt = '',
  className,
  tokenOverride,
  refetchKey,
}: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // Token par défaut depuis localStorage (côté client)
  const token = useMemo(() => {
    if (tokenOverride) return tokenOverride;
    if (typeof window === 'undefined') return undefined;
    try {
      return localStorage.getItem('token') || undefined;
    } catch {
      return undefined;
    }
  }, [tokenOverride]);

  useEffect(() => {
    let aborted = false;
    let currentUrl: string | null = null;

    async function run() {
      setLoading(true);
      setErr(null);
      setBlobUrl(null);

      try {
        const res = await fetch(src, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cache: 'no-store',
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Image ${res.status}: ${text || res.statusText}`);
        }

        const blob = await res.blob();
        if (aborted) return;
        currentUrl = URL.createObjectURL(blob);
        setBlobUrl(currentUrl);
      } catch (e: any) {
        if (aborted) return;
        setErr(e?.message || 'Erreur de chargement de l’image');
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    run();

    return () => {
      aborted = true;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [src, token, refetchKey]);

  if (loading) {
    return (
      <div className={className}>
        <div className="animate-pulse bg-gray-200 rounded-md w-full h-full" />
      </div>
    );
  }

  if (err || !blobUrl) {
    return (
      <div className={className}>
        <div className="text-sm text-red-600">Impossible de charger l’image</div>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={blobUrl} alt={alt} />;
}

