// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import AuthProvider from '@/context/AuthProvider';

export const metadata: Metadata = {
  title: 'Chantiersync Admin',
  description: 'Interface d’administration Chantiersync',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <main className="container-page">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
