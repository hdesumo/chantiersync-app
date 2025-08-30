// components/ReportsList.tsx
"use client";

import { useState, useEffect } from "react";
import { clientGet } from "@/lib/clientApi";

export default function ReportsList({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState(initialReports);

  useEffect(() => {
    async function refreshReports() {
      try {
        const data = await clientGet("/reports");
        setReports(data);
      } catch (err) {
        console.error("Erreur refresh reports:", err);
      }
    }
    refreshReports();
  }, []);

  return (
    <div>
      <h1>Reports</h1>
      <ul>
        {reports.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </div>
  );
}
