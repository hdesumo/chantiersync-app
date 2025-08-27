"use client";

import { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 font-bold text-xl">ChantierSync</div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard/superadmin" className="block py-2 px-3 rounded hover:bg-blue-600">
            SuperAdmin
          </Link>
          <Link href="/dashboard/superadmin/enterprises" className="block py-2 px-3 rounded hover:bg-blue-600">
            Entreprises
          </Link>
          <Link href="/dashboard/tenant" className="block py-2 px-3 rounded hover:bg-blue-600">
            Tenant Admin
          </Link>
          <Link href="/dashboard/tenant/users" className="block py-2 px-3 rounded hover:bg-blue-600">
            Utilisateurs
          </Link>
          <Link href="/dashboard/tenant/sites" className="block py-2 px-3 rounded hover:bg-blue-600">
            Sites
          </Link>
          <Link href="/dashboard/agent" className="block py-2 px-3 rounded hover:bg-blue-600">
            Agent
          </Link>
          <Link href="/dashboard/agent/reports" className="block py-2 px-3 rounded hover:bg-blue-600">
            Rapports
          </Link>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6">
        <header className="mb-6 border-b pb-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </header>
        {children}
      </main>
    </div>
  );
}

