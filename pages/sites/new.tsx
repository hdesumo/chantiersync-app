import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, requireAuth } from '../../lib/api';

export default function NewSite() {
  const router = useRouter();
  const [form, setForm] = useState<any>({ code:'', name:'', location:'', lat:'', lng:'' });
  const [err, setErr] = useState('');

  useEffect(() => { requireAuth(router); }, [router]);

  async function submit(e:any){
    e.preventDefault(); setErr('');
    const payload = {
      code: form.code, name: form.name, location: form.location,
      lat: form.lat ? parseFloat(form.lat) : undefined,
      lng: form.lng ? parseFloat(form.lng) : undefined,
      start_date: new Date().toISOString()
    };
    const r = await apiFetch('/api/sites', { method:'POST', body: JSON.stringify(payload) });
    if (!r.ok) { const d = await r.json(); setErr(d.error||'Erreur'); return;}
    router.replace('/sites');
  }

  return (
    <main style={{maxWidth:700,margin:'5vh auto',fontFamily:'system-ui'}}>
      <h1>Nouveau chantier</h1>
      <form onSubmit={submit}>
        <label>Code<br/><input value={form.code} onChange={e=>setForm({...form, code:e.target.value})} required/></label><br/>
        <label>Nom<br/><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/></label><br/>
        <label>Localisation<br/><input value={form.location} onChange={e=>setForm({...form, location:e.target.value})}/></label><br/>
        <label>Lat<br/><input value={form.lat} onChange={e=>setForm({...form, lat:e.target.value})} /></label><br/>
        <label>Lng<br/><input value={form.lng} onChange={e=>setForm({...form, lng:e.target.value})} /></label><br/>
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button type="submit">Créer</button>
          <button type="button" onClick={()=>router.push('/sites')}>Annuler</button>
        </div>
        {err && <p style={{color:'crimson'}}>{err}</p>}
      </form>
    </main>
  );
}

