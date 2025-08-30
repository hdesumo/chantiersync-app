// app/reports/page.tsx
import ReportsList from "@/components/ReportsList";

export default async function ReportsPage() {
  // ⚡ fetch côté serveur
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
    cache: "no-store",
  });
  const reports = await res.json();

  return <ReportsList initialReports={reports} />;
}
