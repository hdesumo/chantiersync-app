'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { cardClasses, buttonClasses } from '@/components/ui';

type Site = {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  qrcode_url?: string | null;   // si l'API le fournit
  createdAt?: string;
};

export default function SitesPage() {
  const [items, setItems] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // création
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const hasItems = useMemo(() => items && items.length > 0, [items]);

  async function load() {
    setLoading(true); setErr(null);
    try {
      // GET /api/sites (scopé par enterprise_id côté API)
      const { data } = await api.get('/api/sites');
      const list: Site[] = Array.isArray(data) ? data : (data?.items ?? []);
      setItems(list);
    } catch (e:any) {
      setErr(e?.response?.data?.error || e?.message || 'Erreur de chargement');
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      // POST /api/sites
      const payload: any = { name: name.trim() };
      if (address) payload.address = address.trim();
      if (city) payload.city = city.trim();
      if (country) payload.country = country.trim();

      await api.post('/api/sites', payload);
      setName(''); setAddress(''); setCity(''); setCountry('');
      setOpenCreate(false);
      await load();
    } catch (e:any) {
      setErr(e?.response?.data?.error || e?.message || 'Création impossible');
    }
  }

  return (
    <div className="grid gap-4">
      <div className={cardClasses('flex items-center justify-between')}>
        <div>
          <h1 className="text-xl font-semibold">Sites</h1>
          <p className="text-mutedText text-sm">Chantiers du tenant</p>
        </div>
        <button className={buttonClasses('primary')} onClick={()=>setOpenCreate(v=>!v)}>
          Nouveau site
        </button>
      </div>

      {openCreate && (
        <div className={cardClasses()}>
          <form onSubmit={onCreate} className="grid gap-3 max-w-xl">
            <div className="grid gap-1">
              <label className="text-sm text-mutedText">Nom du site</label>
              <input required value={name} onChange={e=>setName(e.target.value)}
                className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand"
                placeholder="Chantier ZAC Est - Tours"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm text-mutedText">Adresse (optionnel)</label>
              <input value={address} onChange={e=>setAddress(e.target.value)}
                className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label className="text-sm text-mutedText">Ville</label>
                <input value={city} onChange={e=>setCity(e.target.value)}
                  className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand" />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-mutedText">Pays</label>
                <input value={country} onChange={e=>setCountry(e.target.value)}
                  className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand" />
              </div>
            </div>
            <div className="flex gap-2">
              <button className={buttonClasses('primary')} type="submit">Créer</button>
              <button className={buttonClasses('ghost')} type="button" onClick={()=>setOpenCreate(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className={cardClasses()}>
        {loading && <div className="text-mutedText">Chargement…</div>}
        {err && <div className="text-red-400">{err}</div>}
        {!loading && !hasItems && !err && <div className="text-mutedText">Aucun site.</div>}

        {!loading && hasItems && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-mutedText">
                <tr className="border-b border-[rgba(255,255,255,0.08)]">
                  <th className="py-2 pr-3">Nom</th>
                  <th className="py-2 pr-3">Adresse</th>
                  <th className="py-2 pr-3">QR</th>
                  <th className="py-2 pr-3">Créé</th>
                </tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.id} className="border-b border-[rgba(255,255,255,0.06)] last:border-0">
                    <td className="py-2 pr-3">{s.name}</td>
                    <td className="py-2 pr-3">
                      {[s.address, s.city, s.country].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="py-2 pr-3">
                      {s.qrcode_url
                        ? <a className="underline" href={s.qrcode_url} target="_blank">Voir</a>
                        : '—'}
                    </td>
                    <td className="py-2 pr-3">{s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

