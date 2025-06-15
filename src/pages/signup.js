'use client';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Nav-sl';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error state
  const [error, setError] = useState({ name: '', email: '', password: '', general: '' });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError({ name: '', email: '', password: '', general: '' }); // Clear errors

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!name.trim()) {
      return setError((prev) => ({ ...prev, name: 'Name is required.' }));
    }

    if (!email.trim()) {
      return setError((prev) => ({ ...prev, email: 'Email is required.' }));
    }

    if (!passwordRegex.test(password)) {
      return setError((prev) => ({
        ...prev,
        password: 'Password must be at least 6 characters long and include uppercase, lowercase, and a number.',
      }));
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      // ✅ Auto-login happens automatically, just redirect
      router.push('/home');
    } catch (err) {
      setError((prev) => ({ ...prev, general: err.message }));
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
            />
            {error.name && <p className="error-text">{error.name}</p>}

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

            <button type="submit">Sign Up</button>
            {error.general && <p className="error-text">{error.general}</p>}
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
