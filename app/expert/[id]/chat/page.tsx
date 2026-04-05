'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  gaps?: { topic: string; description: string }[];
}

export default function ChatPage() {
  const params = useParams();
  const expertId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId, message: userMessage }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, gaps: data.gaps }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const allGaps = messages.filter(m => m.gaps && m.gaps.length > 0).flatMap(m => m.gaps!);

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexShrink: 0, paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={`/expert/${expertId}`} style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textDecoration: 'none' }}>
            ← Back
          </Link>
          <span style={{ fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: 400, letterSpacing: '-0.01em' }}>Chat</span>
        </div>
        {allGaps.length > 0 && (
          <Link href={`/expert/${expertId}/knowledge`} style={{ textDecoration: 'none' }}>
            <span className="badge badge-warning">
              {allGaps.length} gap{allGaps.length > 1 ? 's' : ''} detected
            </span>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '0.5rem',
        marginBottom: '1.5rem',
      }}>
        {messages.length === 0 ? (
          <div style={{ paddingTop: '6rem', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.9375rem' }}>
            Ask anything — the wiki knows what it knows.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' ? (
                  /* User message — clean, no bubble */
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.02em',
                      color: 'var(--muted-foreground)',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                    }}>
                      You
                    </div>
                    <div style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.65,
                      color: 'var(--foreground)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* Assistant message — typographic, editorial */
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.02em',
                      color: 'var(--muted-foreground)',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                    }}>
                      Wiki
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      color: 'var(--foreground)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                    {msg.gaps && msg.gaps.length > 0 && (
                      <div style={{
                        marginTop: '0.875rem',
                        fontSize: '0.8125rem',
                        color: 'var(--muted-foreground)',
                        fontStyle: 'italic',
                      }}>
                        Gap noted: {msg.gaps.map(g => g.topic).join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  color: 'var(--muted-foreground)',
                  marginBottom: '0.5rem',
                  fontWeight: 500,
                }}>
                  Wiki
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '24px' }}>
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="animate-pulse" style={{
                      width: '6px', height: '6px',
                      borderRadius: '50%',
                      background: 'var(--border-strong)',
                      animationDelay: `${delay}ms`,
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
        <input
          type="text"
          className="input"
          style={{ flex: 1 }}
          placeholder="Ask the wiki..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
