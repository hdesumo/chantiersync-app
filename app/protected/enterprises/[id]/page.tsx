// app/protected/enterprises/[id]/page.tsx
import { serverApiFetch } from "@/lib/api.server";
import EnterpriseEditForm from "@/components/enterprises/EnterpriseEditForm";

export default async function EnterpriseDetail({ params }: { params: { id: string } }) {
  const enterprise = await serverApiFetch(`/enterprises/${params.id}`);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Modifier l’entreprise</h1>
      <EnterpriseEditForm enterprise={enterprise} />
    </section>
  );
}
