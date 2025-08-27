"use client";

import { useEffect, useState } from "react";
import { FaUserTie, FaUsers, FaPlus } from "react-icons/fa";

type Manager = { id: number; name: string; email: string };
type Agent = { id: number; name: string; phone: string };

export default function TenantUsersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/users`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
        },
      });
      const data = await res.json();
      setManagers(data.managers);
      setAgents(data.agents);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const createManager = async () => {
    const name = prompt("Nom du manager ?");
    const email = prompt("Email du manager ?");
    if (!name || !email) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/managers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
      },
      body: JSON.stringify({ name, email }),
    });
    const newManager = await res.json();
    setManagers((prev) => [...prev, newManager]);
  };

  const createAgent = async () => {
    const name = prompt("Nom de l’agent ?");
    const phone = prompt("Téléphone de l’agent ?");
    if (!name || !phone) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tenant/agents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TENANT_TOKEN}`,
      },
      body: JSON.stringify({ name, phone }),
    });
    const newAgent = await res.json();
    setAgents((prev) => [...prev, newAgent]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Gestion des utilisateurs</h2>
      {loading && <p>Chargement...</p>}

      {/* Managers */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaUserTie className="mr-2" /> Managers
          </h3>
          <button onClick={createManager} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded">
            <FaPlus className="mr-2" /> Ajouter
          </button>
        </div>
        <ul className="space-y-2">
          {managers.map((m) => (
            <li key={m.id} className="bg-white p-3 shadow rounded">
              {m.name} – <span className="text-gray-500">{m.email}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Agents */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaUsers className="mr-2" /> Agents
          </h3>
          <button onClick={createAgent} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded">
            <FaPlus className="mr-2" /> Ajouter
          </button>
        </div>
        <ul className="space-y-2">
          {agents.map((a) => (
            <li key={a.id} className="bg-white p-3 shadow rounded">
              {a.name} – <span className="text-gray-500">{a.phone}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

