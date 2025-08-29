"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import {
  LayoutDashboard,
  Users,
  Building2,
  Link as LinkIcon,
  FileBarChart2,
  Briefcase,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  // Menus par rôle
  const menus: Record<string, { href: string; label: string; icon: any }[]> = {
    superadmin: [
      { href: "/dashboard/superadmin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/superadmin/enterprises", label: "Entreprises", icon: Building2 },
      { href: "/dashboard/superadmin/affiliates", label: "Affiliés", icon: LinkIcon },
    ],
    tenant: [
      { href: "/dashboard/tenant", label: "Mon Entreprise", icon: Briefcase },
      { href: "/dashboard/tenant/users", label: "Utilisateurs", icon: Users },
      { href: "/dashboard/tenant/sites", label: "Sites", icon: Building2 },
    ],
    agent: [
      { href: "/dashboard/agent", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/agent/reports", label: "Mes Rapports", icon: FileBarChart2 },
    ],
  };

  if (!role) {
    return (
      <aside className="hidden md:flex md:w-64 md:flex-col gap-2 p-3 bg-[#0f172a] text-white">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col gap-2 p-3 border-r border-[rgba(255,255,255,0.08)] bg-[#0f172a]">
      {menus[role]?.map(({ href, label, icon: Icon }) => {
        const Active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={Active ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-xl px-3 py-2 border transition-colors",
              Active
                ? "bg-cardbg border-brand text-brand"
                : "bg-[#0f172a] border-[rgba(255,255,255,0.08)] hover:border-brand hover:text-white",
            ].join(" ")}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        );
      })}
    </aside>
  );
}

