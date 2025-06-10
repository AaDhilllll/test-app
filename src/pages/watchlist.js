'use client';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

      <Navbar />

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

      <Footer />
    </>
  );
}
