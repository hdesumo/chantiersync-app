// app/login/page.tsx
import LoginClient from './LoginClient';

// Route segment config -> doit être côté server
export const dynamic = 'force-dynamic';
export const revalidate = false; // désactive le SSG/ISR pour /login

export default function Page() {
  return <LoginClient />;
}

