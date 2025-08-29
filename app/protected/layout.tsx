"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-dvh">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="font-semibold">ChantierSync — Console</div>
            <nav className="flex gap-4 text-sm">
              <Link href="/">Dashboard</Link>
              <Link href="/enterprises">Entreprises</Link>
              {/* Bouton logout avec data-testid pour Playwright */}
              <button
                data-testid="logout"
                className="px-3 py-1.5 rounded bg-black text-white"
                onClick={() => {
                  // Déclenche le logout côté AuthProvider
                  localStorage.removeItem("token");
                  document.cookie = "cs_session=; Max-Age=0; path=/;";
                  window.location.href = "/login";
                }}
              >
                Se déconnecter
              </button>
            </nav>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

