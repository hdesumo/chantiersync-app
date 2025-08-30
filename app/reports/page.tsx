// app/reports/page.tsx
import React, { useEffect, useState } from "react";
import { clientGet } from "@/lib/clientApi";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    clientGet("/reports").then(setReports).catch(console.error);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Rapports</h1>
      <ul>
        {reports.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </section>
  );
}
