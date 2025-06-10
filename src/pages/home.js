'use client';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function AuthenticatedHome() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Welcome – CineMatch</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" ></link>
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="auth-home">
        <h2>Welcome back to CineMatch 🎬</h2>

        <div className="auth-buttons">
          <button className="btn" onClick={() => router.push('/profile')}>Go to Profile</button>
          <button className="btn" onClick={() => router.push('/watchlist')}>View Watchlist</button>
          <button className="btn" onClick={() => router.push('/chat')}>Ask AI for Suggestions</button>
        </div>
      </main>

      <Footer />
    </>
  );
}
