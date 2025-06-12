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
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="auth-home">
        <h2 className="welcome-home-h2">Welcome back</h2>

        <div className="home-buttons">
        <button className="btn" onClick={() => router.push('/profile')}>
          Go to Profile
        </button>
        <button className="btn" onClick={() => router.push('/watchlist')}>
          View Watchlist
        </button>
        <button className="btn" onClick={() => router.push('/cine-bot')}>
          Ask AI for Suggestions
        </button>
      </div>


        {/* Daily Suggestion Section */}
        <section className="daily-suggestion">
          <h3>Daily Suggestion</h3>
          <div className="suggestion-card">
            <img
              src="/interstellar.jpg"
              alt="Interstellar Poster"
              className="suggestion-image"
            />
            <div className="suggestion-details">
              <h4>Interstellar (2014)</h4>
              <p><strong>Genre:</strong> Sci-Fi, Adventure, Drama</p>
              <p><strong>Directed by:</strong> Christopher Nolan</p>
              <p>
                A team of explorers travel through a wormhole in space in an attempt
                to ensure humanity’s survival. A visually stunning and emotional
                journey through time and space.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
