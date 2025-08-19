import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch, requireAuth } from '../../lib/api';
import AuthorizedImage from '../../components/AuthorizedImage';

type Site = { id: string; code: string; name: string; location?: string|null };

export default function QrBatch() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [size, setSize] = useState(256);
  const [perPage, setPerPage] = useState(8); // nombre d’étiquettes par page (indicatif pour mise en page)

  useEffect(() => {
    requireAuth(router);
    (async () => {
      const r = await apiFetch('/api/sites');
      const data: Site[] = await r.json();
      setSites(data);
      // sélectionne tout par défaut
      const all: Record<string, boolean> = {};
      data.forEach(s => { all[s.id] = true; });
      setSelected(all);
    })();
  }, [router]);

  const chosen = useMemo(() => sites.filter(s => selected[s.id]), [sites, selected]);

  return (
    <main style={{maxWidth:980,margin:'3vh auto',fontFamily:'system-ui'}}>
      <div className="no-print" style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
        <h1 style={{margin:0}}>Impression QR – Chantiers</h1>
        <span style={{flex:1}} />
        <label>Taille (px)
          <input type="number" min={128} max={1024} step={64} value={size}
                 onChange={e=>setSize(parseInt(e.target.value||'256',10))}
                 style={{marginLeft:6,width:90}} />
        </label>
        <label>Par page
          <select value={perPage} onChange={e=>setPerPage(parseInt(e.target.value,10))} style={{marginLeft:6}}>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
        </label>
        <button onClick={()=>window.print()}>Imprimer</button>
      </div>

      <div className="no-print" style={{marginBottom:12}}>
        <button onClick={()=>{
          const all: Record<string, boolean> = {};
          sites.forEach(s => { all[s.id] = true; });
          setSelected(all);
        }}>Tout sélectionner</button>
        <button onClick={()=>{
          const none: Record<string, boolean> = {};
          setSelected(none);
        }} style={{marginLeft:8}}>Tout désélectionner</button>
      </div>

      <div className="no-print" style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:8,marginBottom:16}}>
        {sites.map(s => (
          <label key={s.id} style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="checkbox" checked={!!selected[s.id]} onChange={e=>setSelected({...selected, [s.id]: e.target.checked})}/>
            <span><b>{s.code}</b> — {s.name}{s.location ? ` (${s.location})` : ''}</span>
          </label>
        ))}
      </div>

      <section className="sheet">
        <div className="grid">
          {chosen.map((s, i) => (
            <div key={s.id} className="label">
              <AuthorizedImage path={`/api/sites/${s.id}/qr.png?size=${size}`} alt={`QR ${s.code}`} />
              <div className="meta">
                <div className="code">{s.code}</div>
                <div className="name">{s.name}</div>
                {s.location && <div className="loc">{s.location}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .grid { gap: 0 !important; }
        }
      `}</style>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .label {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 12px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: center;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .label img { width: ${size}px; height: ${size}px; }
        .meta .code { font-weight: 700; font-size: 18px; }
        .meta .name { font-size: 14px; }
        .meta .loc { font-size: 12px; opacity: .7; }
      `}</style>
    </main>
  );
}

