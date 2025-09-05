"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth(); // ✅ on récupère user, pas role

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">ChantierSync</h1>
      <div className="flex items-center space-x-4">
        {user && (
          <span className="text-gray-600 text-sm">
            Connecté en tant que <strong>{user.role}</strong>
          </span>
        )}
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
