'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CineBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [structuredData, setStructuredData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const chatBoxRef = useRef(null);

  // Initialize client-side only state
  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        type: 'ai',
        content: 'Hello! I\'m Cine-bot, your personal movie and TV show assistant. Ask me about any movie, web series, TV show, or get recommendations based on your preferences!',
        timestamp: Date.now(),
        id: 'welcome-message'
      }
    ]);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: Date.now(),
      id: `user-${Date.now()}`
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: conversationHistory
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          type: 'ai',
          content: data.response,
          timestamp: Date.now(),
          structuredData: data.structuredData,
          id: `ai-${Date.now()}`
        };

        setMessages(prev => [...prev, aiMessage]);

        // Store structured data for potential use
        if (data.structuredData && data.structuredData.hasStructuredInfo) {
          setStructuredData(prev => [...prev, data.structuredData]);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: Date.now(),
        isError: true,
        id: `error-${Date.now()}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!isClient) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatMessage = (content) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const getExampleQuestions = () => [
    "Tell me about Inception",
    "Recommend some sci-fi movies",
    "What are the best Netflix series of 2023?",
    "Who directed The Dark Knight?",
    "Suggest horror movies for Halloween"
  ];

  const handleExampleClick = (question) => {
    setInputMessage(question);
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <>
        <Head>
          <title>Cine-bot - Your Movie Assistant | CineMatch</title>
          <meta name="description" content="Chat with Cine-bot to get movie recommendations and information" />
          <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
          <link rel='stylesheet' href="/style.css" />
        </Head>
        <Navbar />
        <div className="chat-container">
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            color: '#e50914',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            🎬 Cine-bot
          </h1>
          <p style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            color: '#aaa',
            fontSize: '1.1rem'
          }}>
            Loading...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Cine-bot - Your Movie Assistant | CineMatch</title>
        <meta name="description" content="Chat with Cine-bot to get movie recommendations and information" />
        <link rel="icon" type="image/jpg" href="images/favicon-jpg.jpg" />
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <Navbar />

      <main className="chat-container">
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#e50914',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          🎬 Cine-bot
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#aaa',
          fontSize: '1.1rem'
        }}>
          Your AI-powered movie and TV show assistant
        </p>

        {/* Example Questions */}
        {isClient && messages.length <= 1 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#ccc', marginBottom: '10px', fontSize: '0.9rem' }}>
              Try asking me about:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {getExampleQuestions().map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.3)';
                    e.target.style.borderColor = '#e50914';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Box */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.type === 'user' ? 'user-msg' : 'ai-msg'}`}
              style={message.isError ? { backgroundColor: '#d32f2f', color: '#fff' } : {}}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: formatMessage(message.content)
                }}
              />
              <div style={{
                fontSize: '0.7rem',
                opacity: 0.7,
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="chat-message ai-msg">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                Cine-bot is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about movies, shows, or get recommendations..."
            disabled={isLoading}
            style={isLoading ? { opacity: 0.6 } : {}}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !inputMessage.trim()}
            style={isLoading || !inputMessage.trim() ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>

        {/* Structured Data Display (Optional) */}
        {structuredData.length > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#e50914', marginBottom: '10px' }}>
              Recent Movie/Show Information:
            </h3>
            {structuredData.slice(-3).map((data, index) => (
              <div key={index} style={{ marginBottom: '10px', fontSize: '0.9rem' }}>
                {data.titles.length > 0 && (
                  <div><strong>Titles:</strong> {data.titles.join(', ')}</div>
                )}
                {data.directors.length > 0 && (
                  <div><strong>Directors:</strong> {data.directors.join(', ')}</div>
                )}
                {data.genres.length > 0 && (
                  <div><strong>Genres:</strong> {data.genres.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <style jsx>{`
        /* Main chat container */
        .chat-container {
          padding: 120px 40px 40px;
          max-width: 800px;
          margin: auto;
          color: #fff;
          background: linear-gradient(135deg, #141414 0%, #000000 100%);
          min-height: 100vh;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        /* Chat messages container */
        .chat-box {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          height: 400px;
          overflow-y: auto;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        /* Individual chat messages */
        .chat-message {
          margin: 10px 0;
          padding: 10px 15px;
          border-radius: 6px;
          max-width: 75%;
          word-wrap: break-word;
          font-size: 1rem;
          line-height: 1.5;
          animation: fadeIn 0.3s ease-in;
        }

        /* User messages */
        .chat-message.user-msg {
          align-self: flex-end;
          background-color: #222;
          text-align: right;
          color:rgb(232, 26, 26);
          border: 1px solid rgb(124, 0, 0);
        }

        /* AI messages */
        .chat-message.ai-msg {
          align-self: flex-start;
          background-color: #333;
          color: #f1faee;
          border: 1px solid rgba(241, 250, 238, 0.2);
        }

        /* Chat input container */
        .chat-input {
          display: flex;
          gap: 10px;
        }

        /* Input field */
        .chat-input input {
          flex: 1;
          padding: 10px;
          border-radius: 4px;
          border: none;
          font-size: 1rem;
          background-color: #1a1a1a;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: border-color 0.2s ease;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #e50914;
        }

        .chat-input input::placeholder {
          color: #aaa;
        }

        /* Send button */
        .chat-input button {
          padding: 10px 20px;
          background-color: #e50914;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s ease-in-out;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chat-input button:hover {
          background-color: #b00610;
          transform: translateY(-1px);
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex;
          gap: 3px;
          align-items: center;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background-color:rgb(232, 26, 26);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        /* Scrollbar styling for Netflix look */
        .chat-box::-webkit-scrollbar {
          width: 6px;
        }

        .chat-box::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .chat-box::-webkit-scrollbar-thumb {
          background: rgba(229, 9, 20, 0.6);
          border-radius: 3px;
        }

        .chat-box::-webkit-scrollbar-thumb:hover {
          background: rgba(229, 9, 20, 0.8);
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .chat-container {
            padding: 80px 20px 20px;
          }
          
          .chat-message {
            max-width: 85%;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}