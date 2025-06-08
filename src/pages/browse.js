'use client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Browse() {
  const router = useRouter();

  const genres = [
    'Action', 'Drama', 'Sci-Fi', 'Romance', 'Comedy',
    'Thriller', 'Horror', 'Fantasy', 'Adventure', 'Documentary'
  ];

  const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam',
    'Kannada', 'Korean', 'Japanese', 'French', 'Spanish'
  ];

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CineMatch – Movie & TV Explorer</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" ></link>
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

      <main className="browse-main">
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search for movies..." />
          <button>Search</button>
        </div>

        {/* Genres */}
        <section className="genre-section">
          <h2>Genres</h2>
          <div className="chip-container">
            {genres.map((genre, index) => (
              <span key={index} className="chip">{genre}</span>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="language-section">
          <h2>Languages</h2>
          <div className="chip-container">
            {languages.map((lang, index) => (
              <span key={index} className="chip">{lang}</span>
            ))}
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 CineMatch. All rights reserved.</p>
      </footer>
    </>
  );
}
