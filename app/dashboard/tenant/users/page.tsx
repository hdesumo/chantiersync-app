"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  role: "manager" | "agent";
  email?: string;
  phone?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/users`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
        },
      });
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Utilisateurs (Managers & Agents)</h2>
      {loading && <p>Chargement...</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Nom</th>
            <th className="p-3 border-b">Rôle</th>
            <th className="p-3 border-b">Contact</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{u.id}</td>
              <td className="p-3 border-b">{u.name}</td>
              <td className="p-3 border-b">{u.role}</td>
              <td className="p-3 border-b">
                {u.role === "manager" ? u.email : u.phone}
              </td>
              <td className="p-3 border-b">
                <Link
                  href={`/dashboard/tenant/users/${u.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

