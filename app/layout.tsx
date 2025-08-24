// app/layout.tsx
// =============================
import './globals.css';
import { AuthProvider } from '@/context/AuthProvider';

export const metadata = {
  title: 'Chantiersync — Admin',
  description: 'Console plateforme',
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

