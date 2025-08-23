// app/partners/page.tsx
// =============================
'use client';
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/ui/Button";


export default function PartnersPage() {
const [items, setItems] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);


async function load() {
try {
setLoading(true);
const { data } = await api.get('/api/affiliates/partners');
setItems(data?.items || []);
} catch (e: any) {
setError(e?.response?.data?.error || e?.message);
} finally { setLoading(false); }
}


useEffect(() => { load(); }, []);


async function createLink(partner_id: string) {
const { data } = await api.post('/api/affiliates/links', { partner_id, campaign: 'default' });
alert(`Lien créé: /aff/r/${data.code}`);
load();
}


return (
<div className="grid gap-4">
<Card>
<div className="flex items-center justify-between mb-3">
<h1 className="text-xl">Partenaires</h1>
<Button onClick={()=>alert('CRUD partenaire à implémenter')}>Nouveau partenaire</Button>
</div>
{loading && <div className="text-mutedText">Chargement…</div>}
{error && <div className="text-red-400">{error}</div>}
<div className="grid gap-2">
{items.map((p) => (
<div key={p.id} className="flex items-center justify-between rounded-xl p-3 border border-[rgba(255,255,255,0.08)] bg-[#0f172a]">
<div>
<div className="font-medium">{p.name}</div>
<div className="text-sm text-mutedText">{p.email || '—'} · {p.status}</div>
</div>
<Button onClick={()=>createLink(p.id)}>Créer un lien</Button>
</div>
))}
{!loading && items.length === 0 && <div className="text-mutedText">Aucun partenaire</div>}
</div>
</Card>
</div>
);
}
