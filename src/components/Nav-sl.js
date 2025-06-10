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
    </header>
  );
}
