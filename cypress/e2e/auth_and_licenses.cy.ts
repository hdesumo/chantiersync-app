"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">ChantierSync</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard/superadmin" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/dashboard/licenses" className="hover:text-blue-600">
            Licenses
          </Link>
          <Link href="/dashboard/tenants" className="hover:text-blue-600">
            Tenants
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Tableau de bord</h1>
            {user && (
              <p className="text-sm text-gray-500">
                Connecté en tant que <span className="font-medium">{user.email}</span> ({user.role})
              </p>
            )}
          </div>
          <div>
            <button
              data-testid="logout"  // 👈 Ajout du data-testid pour Cypress
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
