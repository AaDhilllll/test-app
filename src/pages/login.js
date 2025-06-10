'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Nav-sl';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy authentication check
    if (email === 'user@cinematch.com' && password === '123456') {
      // Simulate login success
      router.push('/home'); // Redirect to home page
    } else {
      alert('Invalid credentials. Use user@cinematch.com / 123456');
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CineMatch – Movie & TV Explorer</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="auth-container">
        <div className="auth-box">
          <h2>Login to CineMatch</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
