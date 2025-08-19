// pages/login.tsx
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@demo.local');
  const [password, setPassword] = useState('admin123');
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // déjà connecté ? on file sur /reports
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/reports');
    }
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await r.json().catch(() => ({} as any));
      if (!r.ok || !data.token) {
        setErr(data.error || 'Identifiants invalides');
        return;
      }
      localStorage.setItem('token', data.token);
      router.replace('/reports');
    } catch (e) {
      setErr('Connexion au serveur impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{maxWidth:420,margin:'10vh auto',fontFamily:'system-ui'}}>
      <h1>ChantierSync – Admin</h1>
      <form onSubmit={onSubmit}>
        <label>Email<br/>
          <input
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
            autoFocus
          />
        </label><br/>
        <label>Mot de passe<br/>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={()=>setShowPwd(s=>!s)}>
              {showPwd ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </label><br/>
        <button type="submit" disabled={loading} style={{marginTop:8}}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
        {err && <p style={{color:'crimson'}}>{err}</p>}
      </form>
      <p style={{opacity:.7,marginTop:12,fontSize:12}}>
        API: <code>{API_URL}</code>
      </p>
    </main>
  );
}

