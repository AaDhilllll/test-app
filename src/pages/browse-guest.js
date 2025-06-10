'use client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Nav-browse-guest'; 
import Footer from '@/components/Footer';

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
      
      <Navbar />

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

      <Footer />
    </>
  );
}
