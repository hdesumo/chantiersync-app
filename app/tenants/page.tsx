// app/tenants/page.tsx
import React, { useEffect, useState } from "react";
import { clientGet } from "@/lib/clientApi";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    clientGet("/tenants").then(setTenants).catch(console.error);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Tenants</h1>
      <ul>
        {tenants.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </section>
  );
}
