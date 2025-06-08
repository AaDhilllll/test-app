'use client';
import Link from 'next/link';
import Head from 'next/head';
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

      <header className="main-header">
        <div className="logo">CineMatch</div>
        <nav className="nav-links">
          <Link href="/">Landing</Link>
          <Link href="/browse">Browse</Link>
          <Link href="/home">Home</Link>
          <Link href="/logout">Logout</Link>
        </nav>
      </header>

      <main className="auth-home">
        <h2>Welcome back to CineMatch 🎬</h2>

        <div className="auth-buttons">
          <button className="btn" onClick={() => router.push('/profile')}>Go to Profile</button>
          <button className="btn" onClick={() => router.push('/watchlist')}>View Watchlist</button>
          <button className="btn" onClick={() => router.push('/chat')}>Ask AI for Suggestions</button>
        </div>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 CineMatch. All rights reserved.</p>
      </footer>
    </>
  );
}
