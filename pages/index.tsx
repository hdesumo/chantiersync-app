// pages/index.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function Home() {
  const router = useRouter();
  useEffect(()=>{ const t = localStorage.getItem('token'); router.replace(t?'/reports':'/login'); },[router]);
  return null;
}

