// app/(protected)/enterprises/page.tsx
import { serverApiFetch, type Enterprise } from "@/lib/api";
import EnterpriseCreateForm from "@/components/enterprises/EnterpriseCreateForm";


export default async function EnterprisesPage() {
const { items } = await serverApiFetch<{ items: Enterprise[] }>("/api/enterprises?limit=20");
return (
<section className="space-y-6">
<h1 className="text-2xl font-semibold">Entreprises</h1>
<EnterpriseCreateForm />
<div className="rounded-2xl border">
<div className="p-4 border-b font-medium">Liste</div>
<ul className="divide-y">
{items.map((e) => (
<li key={e.id} className="p-4 flex items-center gap-4">
{e.logo_url ? (
<img src={e.logo_url} alt={e.name} className="h-10 w-10 object-contain rounded border" />
) : (
<div className="h-10 w-10 rounded border grid place-items-center text-xs opacity-60">Logo</div>
)}
<div className="flex-1">
<div className="font-medium">{e.name}</div>
<div className="text-sm opacity-70">{e.phone} {e.address ? `· ${e.address}` : ""}</div>
{e.leaders?.length ? (
<div className="text-xs opacity-70 mt-1">Dirigeants: {e.leaders.join(", ")}</div>
) : null}
</div>
<a href={`/enterprises/${e.id}`} className="text-blue-600 text-sm">Modifier</a>
</li>
))}
{items.length === 0 && <li className="p-4 text-sm opacity-70">Aucune entreprise</li>}
</ul>
</div>
</section>
);
}
