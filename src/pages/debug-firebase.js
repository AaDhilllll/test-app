"use client";
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth, db } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function DebugFirebase() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [readResult, setReadResult] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  const testRead = async () => {
    setStatus('Reading...');
    if (!user) {
      setStatus('No authenticated user.');
      return;
    }

    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      setReadResult(snap.exists() ? snap.data() : 'No user doc');
      setStatus('Read OK');
    } catch (err) {
      console.error('Read error:', err);
      setStatus('Read failed: ' + (err.message || String(err)));
    }
  };

  const testWrite = async () => {
    setStatus('Writing...');
    if (!user) {
      setStatus('No authenticated user.');
      return;
    }

    try {
      const ref = doc(db, 'users', user.uid, 'debug', 'ping');
      await setDoc(ref, { ping: true, ts: serverTimestamp() });
      setStatus('Write OK');
    } catch (err) {
      console.error('Write error:', err);
      setStatus('Write failed: ' + (err.message || String(err)));
    }
  };

  return (
    <>
      <Head>
        <title>Debug – Firebase</title>
      </Head>

      <Navbar />

      <main style={{ padding: 20 }}>
        <h2>Firebase Debug</h2>
        <p><strong>Auth user:</strong> {user ? user.email + ' (' + user.uid + ')' : 'Not signed in'}</p>
        <p><strong>Status:</strong> {status}</p>

        <div style={{ marginTop: 12 }}>
          <button onClick={testRead} style={{ marginRight: 8 }}>Test Read</button>
          <button onClick={testWrite}>Test Write</button>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3>Read Result</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(readResult, null, 2)}</pre>
        </div>
      </main>

      <Footer />
    </>
  );
}
