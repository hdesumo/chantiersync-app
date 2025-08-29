"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        alert("Un lien de réinitialisation a été envoyé à votre email ✅");
      } else {
        alert("Erreur, email introuvable");
      }
    } catch (err) {
      console.error("Erreur reset-password", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Réinitialiser le mot de passe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <a href="/login" className="text-blue-600 hover:underline">
            Retour à la connexion
          </a>
        </p>
      </div>
    </div>
  );
}

