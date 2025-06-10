'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Signup() {
  return (
    <>
      <Head>
        <title>Signup – CineMatch</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" ></link>
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="auth-container">
        <div className="auth-box">
          <h2>Create your CineMatch account</h2>
          <form className="auth-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
          <p className="switch-text">
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
