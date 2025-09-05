"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-100 h-screen p-6">
      <nav className="space-y-4">
        <Link href="/dashboard" className="block hover:underline">
          Tableau de bord
        </Link>

        {user?.role === "SUPERADMIN" && (
          <>
            <Link href="/dashboard/superadmin/users" className="block hover:underline">
              Utilisateurs
            </Link>
            <Link href="/dashboard/superadmin/enterprises" className="block hover:underline">
              Entreprises
            </Link>
            <Link href="/dashboard/superadmin/licenses" className="block hover:underline">
              Licences
            </Link>
            <Link href="/dashboard/superadmin/reports" className="block hover:underline">
              Rapports
            </Link>
          </>
        )}

        {user?.role === "TENANT" && (
          <>
            <Link href="/dashboard/tenant/sites" className="block hover:underline">
              Mes Sites
            </Link>
            <Link href="/dashboard/tenant/reports" className="block hover:underline">
              Rapports
            </Link>
          </>
        )}

        {user?.role === "AGENT" && (
          <>
            <Link href="/dashboard/agent/reports" className="block hover:underline">
              Rapports Agents
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
