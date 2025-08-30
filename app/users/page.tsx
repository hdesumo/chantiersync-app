// app/users/page.tsx
import React, { useEffect, useState } from "react";
import { clientGet } from "@/lib/clientApi";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    clientGet("/users").then(setUsers).catch(console.error);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Utilisateurs</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>
    </section>
  );
}
