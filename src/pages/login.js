'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Nav-sl';
import Footer from '@/components/Footer';

export default function Login() {
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

      <main className="auth-container">
        <div className="auth-box">
          <h2>Login to CineMatch</h2>
          <form className="auth-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
          <p className="switch-text">
            Don't have an account? <Link href="/signup">Sign up here</Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
