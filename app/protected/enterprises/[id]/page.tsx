// app/protected/enterprises/[id]/page.tsx
import { serverApiFetch } from "@/lib/api";
import EnterpriseEditForm from "@/components/enterprises/EnterpriseEditForm";

interface Enterprise {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
}

export default async function EnterpriseEditPage({
  params,
}: {
  params: { id: string };
}) {
  const enterprise = await serverApiFetch<Enterprise>(`/enterprises/${params.id}`);

  return (
    <section className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Modifier l’entreprise</h1>
      <EnterpriseEditForm enterprise={enterprise} />
    </section>
  );
}
