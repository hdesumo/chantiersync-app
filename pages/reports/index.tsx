// pages/reports/index.tsx
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
      <button onClick={()=>router.push('/reports/new')}>Nouveau rapport</button>
      <ul>{rows.map(r=>(
        <li key={r.id}><b>{r.type}</b> — {r.title} — {new Date(r.createdAt).toLocaleString()}</li>
      ))}</ul>
    </main>
  );
}

