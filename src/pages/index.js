import Head from 'next/head';
import Link from 'next/link';


export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CineMatch – Movie & TV Explorer</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" ></link>
      </Head>

      <header className="main-header">
        <div className="logo">CineMatch</div>
        <nav className="nav-links">
          <Link href="/home">Home</Link>
          <Link href="/browse">Browse</Link>
          <Link href="/watchlist">Watchlist</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </nav>
      </header>

      <section className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-track">
            <img src="/interstellar.jpg" alt="Movie 1 Poster" />
            <img src="/sinners.jpg" alt="Movie 2 Poster" />
            <img src="/lalaland.png" alt="Movie 3 Poster" />
            <img src="/The_Godfather.jpg" alt="Movie 4 Poster" />

            <img src="/interstellar.jpg" alt="Movie 1 Poster" />
            <img src="/sinners.jpg" alt="Movie 2 Poster" />
            <img src="/lalaland.png" alt="Movie 3 Poster" />
            <img src="/The_Godfather.jpg" alt="Movie 4 Poster" />
          </div>
        </div>
      </section>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Unlimited Movies, TV Shows Reviews</h1>
          <p>Personalized AI Recommendations when you can't figure out what you want to binge</p>
          <form className="email-signup">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Get Started</button>
          </form>
        </div>
      </section>

      <footer className="main-footer">
        <p>&copy; 2025 CineMatch. All rights reserved.</p>
      </footer>
    </>
  );
}
