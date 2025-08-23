import "./globals.css";
import Sidebar from "../components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="mx-auto max-w-screen-2xl px-4 py-6 flex gap-4">
          <Sidebar />
          <main className="flex-1 min-h-[70vh]">{children}</main>
        </div>
      </body>
    </html>
  );
}

