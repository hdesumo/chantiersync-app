"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // 👉 Menu centralisé
  const menu = [
    { href: "/dashboard/superadmin", label: "SuperAdmin" },
    { href: "/dashboard/superadmin/enterprises", label: "Entreprises" },
    { href: "/dashboard/tenant", label: "Tenant Admin" },
    { href: "/dashboard/tenant/users", label: "Utilisateurs" },
    { href: "/dashboard/tenant/sites", label: "Sites" },
    { href: "/dashboard/agent", label: "Agent" },
    { href: "/dashboard/agent/reports", label: "Rapports" },
    { href: "/dashboard/licenses", label: "Licenses" },
  ];

  // 👉 Déterminer le titre actif
  const activeItem = menu.find((item) => pathname.startsWith(item.href));
  const pageTitle = activeItem ? activeItem.label : "Dashboard";

  // 👉 Gestion logout
  const handleLogout = () => {
    logout(); // doit vider le token et user
    router.push("/login"); // redirige vers la page de login
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 font-bold text-xl">ChantierSync</div>
        <nav className="flex-1 px-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 px-3 rounded transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-blue-900 font-semibold"
                  : "hover:bg-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="mb-6 border-b pb-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{pageTitle}</h1>

          {/* User info + Logout */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">
              {user?.name || user?.email || "Utilisateur"}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

