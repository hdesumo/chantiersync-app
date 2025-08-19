import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { API_URL, requireAuth, apiFetch, apiUpload } from '../../lib/api';

export default function ReportDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [report, setReport] = useState<any>(null);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    if (!id) return;
    const r = await apiFetch(`/api/reports/${id}`);
    if (!r.ok) { setErr('Introuvable'); return; }
    setReport(await r.json());
  }

  useEffect(() => { requireAuth(router); }, [router]);
  useEffect(() => { load(); }, [id]);

  async function uploadFile() {
    setErr('');
    const file = fileRef.current?.files?.[0];
    if (!file || !id) return;
    const fd = new FormData();
    fd.append('file', file);
    const r = await apiUpload(`/api/reports/${id}/attachments`, fd);
    if (!r.ok) { const d = await r.json().catch(()=>({})); setErr(d.error||'Upload échoué'); return; }
    fileRef.current!.value = '';
    await load();
  }

  if (!report) return <main style={{maxWidth:900,margin:'5vh auto',fontFamily:'system-ui'}}><p>Chargement…</p></main>;

  return (
    <main style={{maxWidth:900,margin:'5vh auto',fontFamily:'system-ui'}}>
      <button onClick={()=>router.push('/reports')}>← Retour</button>
      <h1>Rapport</h1>
      <p><b>Type:</b> {report.type} &nbsp; <b>Priorité:</b> {report.priority}</p>
      <p><b>Titre:</b> {report.title}</p>
      <p><b>Description:</b> {report.description || '—'}</p>
      <p><b>Créé le:</b> {new Date(report.createdAt).toLocaleString()}</p>

      <h2>Pièces jointes</h2>
      <ul>
        {(report.ReportMedia || []).map((m:any) => (
          <li key={m.id}>
            <a href={`${API_URL}${m.path}`} target="_blank" rel="noreferrer">
              {m.meta?.originalname || m.path}
            </a> ({m.mime_type || 'fichier'})
          </li>
        ))}
        {(!report.ReportMedia || report.ReportMedia.length===0) && <li>Aucune pièce jointe.</li>}
      </ul>

      <div style={{marginTop:16}}>
        <input ref={fileRef} type="file" />
        <button onClick={uploadFile}>Téléverser</button>
        {err && <p style={{color:'crimson'}}>{err}</p>}
      </div>
    </main>
  );
}

