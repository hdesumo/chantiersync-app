import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, requireAuth } from '../../lib/api';

export default function Reports() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ requireAuth(router); (async()=>{
    const r = await apiFetch('/api/reports'); const data = await r.json(); setRows(data);
  })(); },[router]);

  return (
    <main style={{maxWidth:900,margin:'5vh auto',fontFamily:'system-ui'}}>
      <h1>Rapports</h1>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <button onClick={()=>router.push('/reports/new')}>Nouveau rapport</button>
        <button onClick={()=>router.push('/sites')}>Chantiers</button>
      </div>
      <ul>
        {rows.map(r=>(
          <li key={r.id}>
            <b>{r.type}</b> — <a onClick={()=>router.push(`/reports/${r.id}`)} style={{cursor:'pointer', textDecoration:'underline'}}>{r.title}</a> — {new Date(r.createdAt).toLocaleString()}
          </li>
        ))}
        {rows.length===0 && <li>Aucun rapport pour l’instant.</li>}
      </ul>
    </main>
  );
}

