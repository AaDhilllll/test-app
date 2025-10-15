'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Nav-sl';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ name: '', email: '', password: '', general: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError({ name: '', email: '', password: '', general: '' });
    setSuccess('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!name.trim()) return setError((p) => ({ ...p, name: 'Name is required.' }));
    if (!email.trim()) return setError((p) => ({ ...p, email: 'Email is required.' }));
    if (!passwordRegex.test(password))
      return setError((p) => ({
        ...p,
        password:
          'Password must be at least 6 characters long and include uppercase, lowercase, and a number.',
      }));

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Firestore write
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      setSuccess('✅ Signed up successfully! Redirecting to login...');
      setLoading(false);

      // Reset form fields
      setName('');
      setEmail('');
      setPassword('');

      // Redirect after 2 seconds
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      console.error('Signup Error:', err);
      setLoading(false);
      let msg = 'Signup failed. Please try again.';

      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      else if (err.code === 'auth/invalid-email') msg = 'Invalid email format.';
      else if (err.code === 'auth/weak-password') msg = 'Weak password. Try a stronger one.';

      setError((p) => ({ ...p, general: msg }));
    }
  };

  return (
    <>
      <Head>
        <title>Signup – CineMatch</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="auth-container">
        <div className="auth-box">
          <h2>Create your CineMatch account</h2>
          <form className="auth-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            {error.name && <p className="error-text">{error.name}</p>}

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
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            {error.general && <p className="error-text">{error.general}</p>}
            {success && <p className="success-text">{success}</p>}
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
