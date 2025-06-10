'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel'; 
import Footer from '@/components/Footer';


export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem('userEmail', email);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CineMatch – Movie & TV Explorer</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
      </Head>

      <Navbar />

      <Carousel />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Unlimited Movies, TV Shows Reviews</h1>
          <p>Personalized AI Recommendations when you can't figure out what you want to binge</p>

          {submitted ? (
            <p className="success-message">Thanks for signing up!</p>
          ) : (
            <form className="email-signup" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Get Started</button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
