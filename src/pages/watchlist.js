'use client';
import Link from 'next/link';
import Head from 'next/head';

export default function Watchlist() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CineMatch – Movie & TV Explorer</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" ></link>
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <header className="main-header">
        <div className="logo">CineMatch</div>
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/browse">Browse</Link>
          <Link href="/watchlist">Watchlist</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </nav>
      </header>

      <main className="watchlist-container">
        <h2>Your Watchlist</h2>
        <div className="watchlist-grid">
          {/* Watchlist items */}
          {[1, 2, 3, 4].map((item) => (
            <div className="watchlist-placeholder" key={item}>
              <p>Watchlist item #{item}</p>
              <div className="button-group">
                <button className="btn btn-secondary">Mark as Watched</button>
                <button className="btn btn-danger">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 CineMatch. All rights reserved.</p>
      </footer>
    </>
  );
}
