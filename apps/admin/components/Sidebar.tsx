// components/Sidebar.tsx
// =============================
'use client';
import Link from "next/link";
import { LayoutDashboard, Users, Building2, Link as LinkIcon, FileBarChart2 } from "lucide-react";
import { usePathname } from "next/navigation";


const nav = [
{ href: "/", label: "Dashboard", icon: LayoutDashboard },
{ href: "/partners", label: "Partenaires", icon: LinkIcon },
{ href: "/users", label: "Utilisateurs", icon: Users },
{ href: "/tenants", label: "Tenants", icon: Building2 },
{ href: "/reports", label: "Rapports", icon: FileBarChart2 },
];


export default function Sidebar() {
const pathname = usePathname();
return (
<aside className="hidden md:flex md:w-64 md:flex-col gap-2 p-3 border-r border-[rgba(255,255,255,0.08)] bg-black/10">
{nav.map((n) => {
const Active = pathname === n.href;
const Icon = n.icon;
return (
<Link key={n.href} href={n.href}
className={["flex items-center gap-3 rounded-xl px-3 py-2 border",
Active ? "bg-cardbg border-brand" : "bg-[#0f172a] border-[rgba(255,255,255,0.08)] hover:border-brand"].join(" ")}
>
<Icon size={18} /> <span>{n.label}</span>
</Link>
);
})}
</aside>
);
}
