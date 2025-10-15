'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Nav-sl';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '', general: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({ email: '', password: '', general: '' }); // Reset error

    if (!email.trim()) {
      return setError((prev) => ({ ...prev, email: 'Email is required.' }));
    }

    if (!password.trim()) {
      return setError((prev) => ({ ...prev, password: 'Password is required.' }));
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err) {
      setError((prev) => ({ ...prev, general: err.message }));
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
            {error.email && <p className="error-text">{error.email}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error.password && <p className="error-text">{error.password}</p>}

            <button type="submit">Login</button>
            {error.general && <p className="error-text">{error.general}</p>}
          </form>

          <p className="switch-text">
            Don't have an account? <Link href="/signup">Sign up here</Link>
          </p>

          <p className="switch-text">
            <button
              type="button"
              onClick={async () => {
                if (!email.trim()) {
                  return setError((prev) => ({ ...prev, email: 'Enter your email to reset password.' }));
                }
                try {
                  const { sendPasswordResetEmail } = await import('firebase/auth');
                  await sendPasswordResetEmail(auth, email);
                  alert('Password reset link sent to your email.');
                } catch (err) {
                  setError((prev) => ({ ...prev, general: err.message }));
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#e50914',
                cursor: 'pointer',
                paddingTop: '10px',
              }}
            >
              Forgot password?
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
