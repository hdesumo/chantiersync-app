import Link from "next/link";
import { cardClasses } from "@/components/ui";

export default function Page(){
  return (
    <div className="grid gap-4">
      <div className={cardClasses()}>Bienvenue dans l'espace client — choisissez une section.</div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        {[
          {href:'/sites', label:'Sites'},
          {href:'/reports', label:'Rapports'},
          {href:'/media', label:'Médias'},
          {href:'/users', label:'Utilisateurs'},
          {href:'/exports', label:'Exports'},
          {href:'/qr', label:'QR'}
        ].map(x=> <Link key={x.href} className={cardClasses('text-center')} href={x.href}>{x.label}</Link>)}
      </div>
    </div>
  );
}

