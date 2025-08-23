// components/AuthorizedImage.tsx
'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

type Props = {
  /** chemin API: ex. `/api/sites/123/qr.png?size=256` (ou URL absolue) */
  src: string;
  token: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
};

function toAbsolute(urlOrPath: string): string {
  try {
    return new URL(urlOrPath).toString(); // déjà absolu
  } catch {
    return new URL(urlOrPath, API_URL).toString(); // relatif -> absolu
  }
}

export default function AuthorizedImage({
  src, token, alt = '', className, width, height,
}: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
    const abs = toAbsolute(src);

    (async () => {
      try {
        setErr(null);
        setBlobUrl(null);
        const res = await fetch(abs, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (!revoked) setBlobUrl(url);
      } catch (e: any) {
        setErr(e?.message || 'load failed');
      }
    })();

    return () => {
      revoked = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, token]);

  if (err) return <div className="text-sm text-red-600">Image: {err}</div>;
  if (!blobUrl) return <div className="text-gray-500 text-sm">Chargement…</div>;

  return <img src={blobUrl} alt={alt} className={className} width={width} height={height} />;
}

