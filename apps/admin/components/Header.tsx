'use client';
import { buttonClasses } from '@/components/ui'; // ⬅️ local
import { LogOut } from 'lucide-react';

export default function Header() {
  function onLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'token=; Max-Age=0; Path=/';
      window.location.href = '/login';
    }
  }
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/20 border-b border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-screen-2xl px-4 h-14 flex items-center justify-between">
        <div className="font-medium">Chantiersync — Admin</div>
        <button className={buttonClasses('ghost', 'px-3 py-1')} onClick={onLogout}>
          <LogOut size={16} /> Quitter
        </button>
      </div>
    </header>
  );
}

