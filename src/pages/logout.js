'use client';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (err) {
        console.error('Logout failed:', err);
        router.push('/login');
      }
    };

    doLogout();
  }, [router]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px', color: '#fff' }}>
      Logging you out...
    </div>
  );
}
