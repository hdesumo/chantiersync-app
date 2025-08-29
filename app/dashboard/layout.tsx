"use client";

import React from "react";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">ChantierSync</h2>
        <nav className="space-y-2">
          <Link href="/dashboard/superadmin" className="block hover:text-blue-600">
            Tableau de bord
          </Link>
          <Link href="/licenses" className="block hover:text-blue-600">
            Licenses
          </Link>
          <Link href="/users" className="block hover:text-blue-600">
            Utilisateurs
          </Link>
          <Link href="/tenants" className="block hover:text-blue-600">
            Tenants
          </Link>
          <Link href="/sites" className="block hover:text-blue-600">
            Sites
          </Link>
          <Link href="/reports" className="block hover:text-blue-600">
            Rapports
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Espace Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
              {user?.email || "Utilisateur"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <section>{children}</section>
      </main>
    </div>
  );
}

