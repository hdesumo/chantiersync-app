"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type User = {
  id: number;
  name: string;
  role: "manager" | "agent";
  email?: string;
  phone?: string;
};

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/users/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
        },
      });
      const data = await res.json();
      setUser(data);
      setLoading(false);
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Utilisateur introuvable.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Détail utilisateur</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="font-semibold">Nom : {user.name}</p>
        <p className="text-gray-600">Rôle : {user.role}</p>
        {user.role === "manager" && <p className="text-gray-600">Email : {user.email}</p>}
        {user.role === "agent" && <p className="text-gray-600">Téléphone : {user.phone}</p>}
      </div>
    </div>
  );
}

