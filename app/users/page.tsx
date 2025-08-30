// app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { clientGet } from "@/lib/clientApi";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientGet("/users")
      .then((data) => setUsers(data || []))
      .catch((err) => console.error("Erreur fetch users:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des utilisateurs...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Liste des Utilisateurs</h1>
      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <ul className="list-disc pl-6">
          {users.map((u) => (
            <li key={u.id}>{u.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
