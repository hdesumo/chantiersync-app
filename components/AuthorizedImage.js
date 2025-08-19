import { useEffect, useState } from 'react';
import { API_URL } from '../lib/api';

type Props = {
  /** chemin côté API, ex: `/api/sites/123/qr.png?size=256` */
  path: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (e: unknown) => void;
};

export default function AuthorizedImage({ path, alt, className, style, onError }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
        const res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (e) {
        onError?.(e);
      }
    })();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [path, onError]);

  if (!url) return <div style={{ width: 256, height: 256, background: '#eee' }} />;
  return <img src={url} alt={alt || ''} className={className} style={style} />;
}

