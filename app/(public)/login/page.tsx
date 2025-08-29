"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clientApi from "@/lib/clientApi";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("📤 Tentative login avec:", { email, password });

      const response = await clientApi.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Réponse backend:", response.data);

      const { token, user } = response.data;

      // stocker en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("🔑 Token sauvegardé:", token);
      console.log("👤 Utilisateur connecté:", user);

      // redirection selon rôle
      if (user.role === "SUPERADMIN") {
        router.push("/dashboard/superadmin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("❌ Erreur login:", err.response?.data || err.message);
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="superadmin@chantiersync.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="superadmin123"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

