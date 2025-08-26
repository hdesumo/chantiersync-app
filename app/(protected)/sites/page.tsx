// app/(protected)/sites/page.tsx
import { serverApiFetch } from "@/lib/serverFetch";
import SitesTable from "@/components/sites/SitesTable";

type Site = { id: number; name: string; city?: string };

export default async function SitesPage() {
  const data = await serverApiFetch<{ items: Site[] }>("/api/sites?limit=20");
  return <SitesTable initialItems={data.items} />;
}

