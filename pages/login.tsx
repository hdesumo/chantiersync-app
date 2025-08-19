// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('admin@demo.local');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function onSubmit(e: any) {
    e.preventDefault(); setErr('');
    const r = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await r.json();
    if (!r.ok) return setErr(data.error || 'Erreur');
    localStorage.setItem('token', data.token);
    router.replace('/reports');
  }

  return (
    <main style={{maxWidth:420,margin:'10vh auto',fontFamily:'system-ui'}}>
      <h1>ChantierSync – Admin</h1>
      <form onSubmit={onSubmit}>
        <label>Email<br/><input value={email} onChange={e=>setEmail(e.target.value)} /></label><br/>
        <label>Mot de passe<br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label><br/>
        <button type="submit">Se connecter</button>
        {err && <p style={{color:'crimson'}}>{err}</p>}
      </form>
    </main>
  );
}

