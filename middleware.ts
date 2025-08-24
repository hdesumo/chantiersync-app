'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;           // URL absolue ou relative à l’API
  preferQueryToken?: boolean; // true => tente ?token=xxx d’abord
};

export default function AuthorizedImage({ src, preferQueryToken, ...imgProps }: Props) {
  const { token } = useAuth();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const withQueryToken = useMemo(() => {
    if (!token) return src;
    try {
      const url = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      url.searchParams.set('token', token);
      return url.toString();
    } catch {
      // si src est absolu HTTP(s) ce sera OK ; sinon on laisse tel quel
      return src.includes('?') ? `${src}&token=${encodeURIComponent(token)}` : `${src}?token=${encodeURIComponent(token)}`;
    }
  }, [src, token]);

  useEffect(() => {
    if (!token || preferQueryToken) {
      setBlobUrl(null);
      return;
    }
    let revoked: string | null = null;
    (async () => {
      try {
        const res = await fetch(src, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        revoked = url;
      } catch {
        // fallback: pas de blob => on tentera avec query token via src ci-dessous
        setBlobUrl(null);
      }
    })();
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [src, token, preferQueryToken]);

  const finalSrc = blobUrl || (preferQueryToken && token ? withQueryToken : src);

  return <img src={finalSrc} {...imgProps} />;
}
