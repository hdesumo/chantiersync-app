'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/sites", label: "Sites" },
  { href: "/reports", label: "Rapports" },
  { href: "/media", label: "Médias" },
  { href: "/users", label: "Utilisateurs" },
  { href: "/exports", label: "Exports" },
  { href: "/qr", label: "QR" },
];

export default function Sidebar(){
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col gap-2 p-3 border-r border-[rgba(255,255,255,0.08)] bg-black/10">
      {NAV.map(n => {
        const A = pathname === n.href;
        return (
          <Link key={n.href} href={n.href}
            className={["flex items-center gap-3 rounded-xl px-3 py-2 border",
                        A ? "bg-cardbg border-brand"
                          : "bg-[#0f172a] border-[rgba(255,255,255,0.08)] hover:border-brand"].join(" ")}
          >
            {n.label}
          </Link>
        );
      })}
    </aside>
  );
}

