'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="main-header">
      <div className="logo">CineMatch</div>
      <nav className="nav-links">
        <Link href="/home">Home</Link>
        <Link href="/browse">Browse</Link>
        <Link href="/watchlist">Watchlist</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </nav>
    </header>
  );
}
