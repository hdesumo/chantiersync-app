// app/(protected)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";


export default function ProtectedLayout({ children }: { children: ReactNode }) {
return (
<div className="min-h-dvh">
<header className="flex items-center justify-between p-4 border-b">
<div className="font-semibold">ChantierSync — Console</div>
<nav className="flex gap-4 text-sm">
<Link href="/">Dashboard</Link>
<Link href="/enterprises">Entreprises</Link>
<form action="/api/auth/logout" method="post">
<button className="px-3 py-1.5 rounded bg-black text-white">Se déconnecter</button>
</form>
</nav>
</header>
<main className="p-6">{children}</main>
</div>
);
}
