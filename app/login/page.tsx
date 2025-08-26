"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";
  const { loginWithEmail, loginWithPhone } = useAuth();

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullMobile, setFullMobile] = useState("");
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setErr(null);
    try {
      if (mode === "email") {
        await loginWithEmail({ email, password });
      } else {
        await loginWithPhone({ full_mobile: fullMobile, pin });
      }
      router.replace(next);
    } catch (e: any) {
      setErr(e?.message || "Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl shadow p-6 border">
        <h1 className="text-2xl font-semibold mb-4">Connexion</h1>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode("email")} className={`px-3 py-2 rounded ${mode === "email" ? "bg-black text-white" : "bg-gray-100"}`}>Email</button>
          <button onClick={() => setMode("phone")} className={`px-3 py-2 rounded ${mode === "phone" ? "bg-black text-white" : "bg-gray-100"}`}>Téléphone</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "email" ? (
            <>
              <input type="email" className="w-full border rounded px-3 py-2" placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="w-full border rounded px-3 py-2" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </>
          ) : (
            <>
              <input type="tel" className="w-full border rounded px-3 py-2" placeholder="+221771234567" value={fullMobile} onChange={(e) => setFullMobile(e.target.value)} required />
              <input type="password" className="w-full border rounded px-3 py-2" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} required />
            </>
          )}
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded bg-black text-white py-2 disabled:opacity-50">{submitting ? "Connexion…" : "Se connecter"}</button>
        </form>
      </div>
    </main>
  );
}

