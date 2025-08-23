// app/page.tsx (Dashboard)
// =============================
'use client';
import Card from "@/components/Card";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function Dashboard() {
const [stats, setStats] = useState<any>({ tenants: 0, users: 0, sites: 0, reports: 0 });
const [series, setSeries] = useState<any[]>([]);


useEffect(() => {
// TODO: remplace par de vrais endpoints d'agrégats
setStats({ tenants: 3, users: 42, sites: 12, reports: 87 });
setSeries(Array.from({ length: 14 }, (_, i) => ({ day: `J${i+1}`, leads: Math.floor(Math.random()*20)+2, conv: Math.floor(Math.random()*8) })));
}, []);


return (
<div className="grid gap-4">
<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
<Card><div className="text-sm text-mutedText">Tenants</div><div className="text-2xl font-semibold">{stats.tenants}</div></Card>
<Card><div className="text-sm text-mutedText">Utilisateurs</div><div className="text-2xl font-semibold">{stats.users}</div></Card>
<Card><div className="text-sm text-mutedText">Sites</div><div className="text-2xl font-semibold">{stats.sites}</div></Card>
<Card><div className="text-sm text-mutedText">Rapports</div><div className="text-2xl font-semibold">{stats.reports}</div></Card>
</div>
<Card>
<div className="mb-3">Leads & conversions (14j)</div>
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<AreaChart data={series} margin={{ left: 12, right: 12 }}>
<defs>
<linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#4da3ff" stopOpacity={0.35}/>
<stop offset="100%" stopColor="#4da3ff" stopOpacity={0}/>
</linearGradient>
</defs>
<CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
<XAxis dataKey="day" stroke="#8aa0c6"/>
<YAxis stroke="#8aa0c6"/>
<Tooltip contentStyle={{ background:'#121a2b', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#eaf1ff' }}/>
<Area type="monotone" dataKey="leads" stroke="#4da3ff" fill="url(#g1)" />
<Area type="monotone" dataKey="conv" stroke="#5ce1a6" fillOpacity={0} />
</AreaChart>
</ResponsiveContainer>
</div>
</Card>
</div>
);
}
