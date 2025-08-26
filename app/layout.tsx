// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "ChantierSync",
  description: "Console client",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

