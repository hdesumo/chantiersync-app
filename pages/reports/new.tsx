// pages/reports/new.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, requireAuth } from '../../lib/api';

export default function NewReport() {
  const router = useRouter();
  const [sites, setSites] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ site_id:'', type:'incident', title:'', description:'', priority:'medium' });

  useEffect(()=>{ requireAuth(router); (async()=>{
    const r = await apiFetch('/api/sites'); const data = await r.json(); setSites(data);
    if (data[0]) setForm((f:any)=>({ ...f, site_id: data[0].id }));
  })(); },[router]);

  async function submit(e:any){ e.preventDefault();
    const r = await apiFetch('/api/reports', { method:'POST', body: JSON.stringify(form) });
    if (r.ok) router.replace('/reports');
  }

  return (
    <main style={{maxWidth:700,margin:'5vh auto',fontFamily:'system-ui'}}>
      <h1>Nouveau rapport</h1>
      <form onSubmit={submit}>
        <label>Chantier<br/>
          <select value={form.site_id} onChange={e=>setForm({...form, site_id:e.target.value})}>
            {sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label><br/>
        <label>Type<br/>
          <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option value="incident">Incident</option>
            <option value="progress">Avancement</option>
            <option value="quality">Qualité</option>
            <option value="safety">Sécurité</option>
          </select>
        </label><br/>
        <label>Titre<br/><input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></label><br/>
        <label>Description<br/><textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></label><br/>
        <label>Priorité<br/>
          <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
            <option value="low">Faible</option><option value="medium">Moyenne</option><option value="high">Haute</option>
          </select>
        </label><br/>
        <button type="submit">Créer</button>
      </form>
    </main>
  );
}

