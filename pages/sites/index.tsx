import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, requireAuth } from '../../lib/api';

export default function Sites() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    requireAuth(router);
    (async () => {
      const r = await apiFetch('/api/sites');
      setRows(await r.json());
    })();
  }, [router]);

  return (
    <main style={{maxWidth:900,margin:'5vh auto',fontFamily:'system-ui'}}>
      <h1>Chantiers</h1>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <button onClick={()=>router.push('/sites/new')}>Nouveau chantier</button>
        <button onClick={()=>router.push('/reports')}>Rapports</button>
      </div>
      <ul>
        {rows.map(s => (
          <li key={s.id}><b>{s.code}</b> — {s.name} {s.location ? `(${s.location})` : ''}</li>
        ))}
        {rows.length === 0 && <li>Aucun chantier pour l’instant.</li>}
      </ul>
    </main>
  );
}

