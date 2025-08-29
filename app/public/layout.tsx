"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthProvider";
import "../globals.css"; // ✅ important pour charger les styles globaux (Tailwind, etc.)

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

