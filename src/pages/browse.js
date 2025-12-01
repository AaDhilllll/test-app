'use client';

import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Browse() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub && unsub();
  }, []);

    const searchWikipedia = async (movieTitle) => {
      try {
        const searchResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(movieTitle)}?redirect=true`
        );

        if (!searchResponse.ok) {
          const altSearchResponse = await fetch(
            `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(movieTitle + ' film')}&limit=1&format=json&origin=*`
          );
          const altData = await altSearchResponse.json();

          if (altData[1] && altData[1].length > 0) {
            const foundTitle = altData[1][0];
            const summaryResponse = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(foundTitle)}?redirect=true`
            );
            const summaryData = await summaryResponse.json();
            return summaryData;
          } else {
            throw new Error('Movie not found');
          }
        }

        return await searchResponse.json();
      } catch (error) {
        throw new Error('Failed to fetch movie data from Wikipedia');
      }
    };

  const extractMovieInfo = (data) => {
    const text = data.extract || '';
    const sentences = text.split('. ');

    const directorMatch = text.match(/directed by ([^.,(]+)/i) || text.match(/director ([^.,(]+)/i);
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    const genreMatch = text.match(/(action|drama|comedy|thriller|horror|romance|sci-fi|science fiction|fantasy|documentary|animation|adventure|crime|mystery|biography|historical|war|western|musical|family|superhero) (film|movie)/i);
    const castMatch = text.match(/starring ([^.]+)/i) || text.match(/stars ([^.]+)/i) || text.match(/featuring ([^.]+)/i);

    const awards = sentences.filter(sentence =>
      ['oscar', 'award', 'nominated', 'won', 'bafta', 'emmy', 'cannes', 'golden globe'].some(word =>
        sentence.toLowerCase().includes(word)
      )
    ).slice(0, 2).join('. ') || 'No major awards information available';

    return {
      title: data.title,
      directedBy: directorMatch?.[1]?.trim() || 'Not available',
      genre: genreMatch ? genreMatch[1][0].toUpperCase() + genreMatch[1].slice(1) : 'Not available',
      yearOfRelease: yearMatch?.[0] || 'Not available',
      description: sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '.' : ''),
      cast: castMatch?.[1]?.trim() || 'Not available',
      awardsAndNominations: awards,
      poster: data.originalimage?.source || data.thumbnail?.source || null,
      wikipediaUrl: data.content_urls?.desktop?.page || '#',
    };
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a movie or series title');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await searchWikipedia(query);
      const info = extractMovieInfo(data);
      setResult(info);
    } catch (err) {
      setError('Movie not found. Please try a different title or check spelling.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const addToWatchlist = async () => {
    // Ensure auth state is available
    const waitForAuth = () => new Promise((resolve) => {
      if (auth.currentUser) return resolve(auth.currentUser);
      const unsub = onAuthStateChanged(auth, (u) => {
        unsub();
        resolve(u);
      });
      // Fallback timeout
      setTimeout(() => {
        try { unsub(); } catch (e) {}
        resolve(auth.currentUser);
      }, 3000);
    });

    const currentUser = user || await waitForAuth();
    if (!currentUser) {
      alert('Please log in to add to watchlist');
      router.push('/login');
      return;
    }

    try {
      const ref = doc(db, 'users', currentUser.uid, 'watchlist', result.title);
      await setDoc(ref, {
        title: result.title,
        genre: result.genre,
        year: result.yearOfRelease,
        watched: false,
        addedAt: serverTimestamp(),
      });
      alert(`${result.title} added to your watchlist!`);
    } catch (err) {
      console.error('Error saving to watchlist:', err);
      alert('Failed to add movie to watchlist. Check console for details.');
    }
  };

  return (
    <>
      <Head>
        <title>Browse – CineMatch</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="browse-main">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter movie or TV series title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <div style={{
          textAlign: 'center',
          color: '#e50914',
          backgroundColor: 'rgba(229,9,20,0.1)',
          padding: '20px',
          borderRadius: '10px',
          margin: '20px auto',
          width: '80%'
        }}>{error}</div>}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '4px solid #333', borderTop: '4px solid #e50914',
              borderRadius: '50%', animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Searching Wikipedia for movie info...</p>
          </div>
        )}

        {result && (
          <div className="results-grid" style={{ padding: '20px 40px' }}>
            <div className="result-card" style={{
              maxWidth: '1200px', width: '100%', margin: '0 auto',
              backgroundColor: '#1a1a1a', borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
              <div style={{
                display: 'flex', gap: '40px', padding: '40px',
                background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)'
              }}>
                {result.poster && (
                  <div style={{ flex: '0 0 300px' }}>
                    <img src={result.poster} alt="Poster"
                      style={{ width: '100%', borderRadius: '12px' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h1 style={{ color: '#e50914', fontSize: '2.8rem', marginBottom: '30px' }}>{result.title}</h1>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <p><strong>Directed by:</strong> {result.directedBy}</p>
                    <p><strong>Genre:</strong> {result.genre}</p>
                    <p><strong>Year:</strong> {result.yearOfRelease}</p>
                    <p><strong>Cast:</strong> {result.cast}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 40px 40px 40px' }}>
                <h3 style={{ color: '#e50914' }}>Description</h3>
                <p style={{ color: '#ccc' }}>{result.description}</p>

                <h3 style={{ color: '#e50914', marginTop: '20px' }}>Awards and Nominations</h3>
                <p style={{ color: '#ccc' }}>{result.awardsAndNominations}</p>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <a
                    href={result.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#fff', backgroundColor: '#e50914',
                      padding: '12px 24px', borderRadius: '8px',
                      textDecoration: 'none', fontWeight: 'bold',
                      marginRight: '15px'
                    }}>
                    View Full Article →
                  </a>

                  <button
                    onClick={addToWatchlist}
                    style={{
                      backgroundColor: '#222', color: '#fff',
                      padding: '12px 24px', borderRadius: '8px',
                      border: '1px solid #e50914', cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#e50914'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#222'; }}>
                    Save to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
