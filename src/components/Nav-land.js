'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="main-header">
      <div className="logo">
        <Link href="/">
          CineMatch
        </Link>
      </div>
      <nav className="nav-links">
        <Link href="/browse-guest">Browse</Link>
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
        
      </nav>
    </header>
  );
}
