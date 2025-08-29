"use client";

import { useAuth } from "@/context/AuthProvider";

export default function Header() {
  const { role, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">
        Tableau de bord
        {role && <span className="ml-2 text-sm text-gray-500">({role})</span>}
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Déconnexion
      </button>
    </header>
  );
}

