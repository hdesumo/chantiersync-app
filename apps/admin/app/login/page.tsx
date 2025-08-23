'use client';
import { useState } from "react";
import api from "@/lib/api";
import { buttonClasses, cardClasses } from "@/components/ui"; // ⬅️ local

export default function Login(){
  const [email,setEmail]=useState("admin@demo.local");
  const [password,setPassword]=useState("admin123");
  const [err,setErr]=useState<string|null>(null);
  const [loading,setLoading]=useState(false);

  async function onSubmit(e:React.FormEvent){
    e.preventDefault(); setErr(null); setLoading(true);
    try{
      const {data}=await api.post('/api/auth/login',{email,password});
      if(data?.token){
        localStorage.setItem('token',data.token);
        document.cookie=`token=${data.token}; Path=/; Max-Age=86400; Secure; SameSite=Lax`;
        window.location.href='/tenants';
      } else setErr('Réponse inattendue');
    } catch(e:any){
      setErr(e?.response?.data?.error || e?.message || 'Erreur');
    } finally { setLoading(false); }
  }

  return (
    <div className="grid place-items-center min-h-[70vh]">
      <div className={cardClasses("w-full max-w-md")}>
        <h1 className="text-2xl mb-2">Connexion</h1>
        <p className="text-mutedText mb-4">Console plateforme</p>
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-mutedText">Email</span>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-mutedText">Mot de passe</span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              className="rounded-xl bg-[#0f172a] border border-[rgba(255,255,255,0.08)] px-3 py-2 outline-none focus:border-brand" />
          </label>
          {err && <div className="text-red-400 text-sm">{err}</div>}
          <button className={buttonClasses('primary')} disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

