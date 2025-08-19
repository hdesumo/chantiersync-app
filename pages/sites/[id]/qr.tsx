import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { requireAuth } from '../../../lib/api';
import AuthorizedImage from '../../../components/AuthorizedImage';

export default function SiteQR() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [size, setSize] = useState(256);

  useEffect(() => { requireAuth(router); }, [router]);

  if (!id) return <main style={{maxWidth:900,margin:'5vh auto'}}>Chargement…</main>;

  return (
    <main style={{maxWidth:900,margin:'5vh auto',fontFamily:'system-ui',textAlign:'center'}}>
      <h1>QR du chantier #{id}</h1>

      <div className="no-print" style={{display:'flex',gap:8,justifyContent:'center',marginBottom:12}}>
        <label>Taille (px)
          <input type="number" min={128} max={1024} step={64} value={size} onChange={e=>setSize(parseInt(e.target.value||'256',10))} style={{marginLeft:8}}/>
        </label>
        <button onClick={()=>window.print()}>Imprimer</button>
        <button onClick={async ()=>{
          const token = localStorage.getItem('token') || '';
          await fetch(`/api/sites/${id}/qr/rotate`, { // proxy via Next ? Ici on va direct API => ajuste si besoin
            method:'POST',
            headers: { Authorization: `Bearer ${token}` }
          });
          location.reload();
        }}>Régénérer</button>
      </div>

      <AuthorizedImage path={`/api/sites/${id}/qr.png?size=${size}`} alt="QR Chantier" />

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </main>
  );
}

