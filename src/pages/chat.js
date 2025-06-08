'use client';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = { user: 'You', text: input };
    setMessages(prev => [...prev, newMessage]);

    // Simulated AI response
    const aiResponse = {
      user: 'AI CineBot',
      text: `Based on your input "${input}", I recommend watching *Inception*.`
    };
    setTimeout(() => {
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <>
      <Head>
        <title>Profile – CineMatch</title>
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" ></link>
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <header className="main-header">
        <div className="logo">CineMatch</div>
        <nav className="nav-links">
          <Link href="/home">Home</Link>
          <Link href="/watchlist">Watchlist</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/logout">Logout</Link>
        </nav>
      </header>

      <main className="chat-container">
        <h2>Chat with CineBot </h2>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.user === 'You' ? 'user' : 'ai'}`}>
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="Ask me what to watch..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 CineMatch. All rights reserved.</p>
      </footer>
    </>
  );
}
