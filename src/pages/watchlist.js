'use client';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchWatchlist = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const listRef = collection(db, 'users', user.uid, 'watchlist');
      const snapshot = await getDocs(listRef);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWatchlist(items);
    };

    fetchWatchlist();
  }, [router]);

  const markAsWatched = async (id) => {
    const user = auth.currentUser;
    const movieRef = doc(db, 'users', user.uid, 'watchlist', id);
    await updateDoc(movieRef, { watched: true });

    setWatchlist(prev =>
      prev.map((item) =>
        item.id === id ? { ...item, watched: true } : item
      )
    );
  };

  const removeItem = async (id) => {
    const user = auth.currentUser;
    const movieRef = doc(db, 'users', user.uid, 'watchlist', id);
    await deleteDoc(movieRef);
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  const clearWatchlist = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const confirm = window.confirm('Are you sure you want to clear your entire watchlist?');
    if (!confirm) return;

    const listRef = collection(db, 'users', user.uid, 'watchlist');
    const snapshot = await getDocs(listRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
    setWatchlist([]);
    alert('Watchlist cleared successfully!');
  };

  return (
    <>
      <Head>
        <title>CineMatch – Movie & TV Explorer</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="watchlist-container">
        <h2>Your Watchlist</h2>

        {/* Clear Watchlist Button */}
        {watchlist.length > 0 && (
          <div style={{ textAlign: 'right', padding: '10px 20px' }}>
            <button className="btn btn-danger" onClick={clearWatchlist}>
              Clear Watchlist
            </button>
          </div>
        )}

        <div className="watchlist-grid">
          {watchlist.length === 0 ? (
            <p>No movies added yet.</p>
          ) : (
            watchlist.map((movie) => (
              <div className="watchlist-placeholder" key={movie.id}>
                <p>{movie.title} — {movie.genre}</p>
                <div className="button-group">
                  {!movie.watched && (
                    <button className="btn btn-secondary" onClick={() => markAsWatched(movie.id)}>
                      Mark as Watched
                    </button>
                  )}
                  <button className="btn btn-danger" onClick={() => removeItem(movie.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
