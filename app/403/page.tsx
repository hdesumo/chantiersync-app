"use client";

import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Accès interdit</h2>
      <p className="text-gray-600 mb-6">
        Désolé, vous n’avez pas les permissions nécessaires pour accéder à cette page.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Retour
        </button>

        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Accueil
        </button>
      </div>
    </div>
  );
}
