'use client';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebaseConfig';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import {
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribeAuth = null;
    let unsubscribeWatchlist = null;

    unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      const baseData = userDoc.exists()
        ? {
            ...userDoc.data(),
            email: currentUser.email,
            memberSince: userDoc.data().createdAt?.toDate().toDateString() || 'N/A',
          }
        : {
            name: 'Unknown',
            email: currentUser.email,
            memberSince: 'N/A',
          };

      const watchlistRef = collection(userRef, 'watchlist');
      unsubscribeWatchlist = onSnapshot(watchlistRef, (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data());
        const watched = items.filter(item => item.watched).length;

        // Calculate favorite genre
        const genreCount = {};
        items.forEach(item => {
          if (item.genre && item.watched) {
            genreCount[item.genre] = (genreCount[item.genre] || 0) + 1;
          }
        });

        const favoriteGenre = Object.entries(genreCount)
          .sort((a, b) => b[1] - a[1])?.[0]?.[0] || '–';

        setUserData({
          ...baseData,
          watchlistCount: items.length,
          watchedCount: watched,
          favoriteGenre,
        });

        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeWatchlist) unsubscribeWatchlist();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Profile – CineMatch</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="profile-container">
        <h2>User Profile</h2>

        <div className="profile-card">
          <div className="profile-info">
            {loading ? (
              <p>Loading user data...</p>
            ) : (
              <>
                <p><strong>Name:</strong> {userData?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {userData?.email || 'N/A'}</p>
                <p><strong>Member Since:</strong> {userData?.memberSince || 'N/A'}</p>
              </>
            )}
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary">Edit Profile</button>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="profile-summary">
          <h3>Watch Stats</h3>
          <ul>
            <li>Movies Watched: {userData?.watchedCount ?? '–'}</li>
            <li>Watchlist Items: {userData?.watchlistCount ?? '–'}</li>
            <li>Favorite Genre: {userData?.favoriteGenre || '–'}</li>
          </ul>
        </div>
      </main>

      <Footer />
    </>
  );
}
