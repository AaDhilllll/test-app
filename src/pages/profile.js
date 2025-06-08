'use client';
import Link from 'next/link';
import Head from 'next/head';

export default function Profile() {
  return (
    <>
      <Head>
        <title>Profile – CineMatch</title>
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

      <main className="profile-container">
        <h2>User Profile</h2>

        <div className="profile-card">
          <div className="profile-info">
            <p><strong>Name:</strong> </p>
            <p><strong>Email:</strong> </p>
            <p><strong>Member Since:</strong> </p>
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary">Edit Profile</button>
            <button className="btn btn-danger">Logout</button>
          </div>
        </div>

        <div className="profile-summary">
          <h3>Watch Stats</h3>
          <ul>
            <li>Movies Watched: </li>
            <li>Watchlist Items: </li>
            <li>Favorite Genre: </li>
          </ul>
        </div>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 CineMatch. All rights reserved.</p>
      </footer>
    </>
  );
}
