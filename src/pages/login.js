'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Nav-sl';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '', general: '' });
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({ email: '', password: '', general: '' });
    setResetMessage('');

    if (!email.trim()) {
      return setError((prev) => ({ ...prev, email: 'Email is required.' }));
    }

    if (!password.trim()) {
      return setError((prev) => ({ ...prev, password: 'Password is required.' }));
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home');
    } catch (err) {
      console.error('Login Error:', err);
      let message = 'Login failed. Please try again.';

      // ✅ Handle specific Firebase Auth errors
      switch (err.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          message =
            'Too many failed attempts. Please try again later or reset your password.';
          break;
        default:
          message = err.message;
          break;
      }

      setError((prev) => ({ ...prev, general: message }));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError({ email: '', password: '', general: '' });
    setResetMessage('');

    if (!email.trim()) {
      return setError((prev) => ({
        ...prev,
        email: 'Enter your email address to reset your password.',
      }));
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset link sent to your email.');
    } catch (err) {
      console.error('Password Reset Error:', err);
      let message = 'Could not send reset email.';
      if (err.code === 'auth/user-not-found') {
        message = 'No user found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      setError((prev) => ({ ...prev, general: message }));
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
              disabled={loading}
            />
            {error.email && <p className="error-text">{error.email}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            {error.password && <p className="error-text">{error.password}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {error.general && <p className="error-text">{error.general}</p>}
            {resetMessage && <p className="success-text">{resetMessage}</p>}
          </form>

          <p className="switch-text">
            Don't have an account? <Link href="/signup">Sign up here</Link>
          </p>

          <p className="switch-text">
            <button
              type="button"
              onClick={handlePasswordReset}
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
