// app/(protected)/enterprises/[id]/page.tsx
import { serverApiFetch, type Enterprise } from "@/lib/api";
import EnterpriseEditForm from "@/components/enterprises/EnterpriseEditForm";


type Props = { params: { id: string } };


export default async function EnterpriseEditPage({ params }: Props) {
const { enterprise } = await serverApiFetch<{ enterprise: Enterprise }>(`/api/enterprises/${params.id}`);
return (
<section className="space-y-6">
<h1 className="text-2xl font-semibold">Modifier l’entreprise</h1>
<EnterpriseEditForm initial={enterprise} />
</section>
);
}
