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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href={`/expert/${expertId}`} style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', textDecoration: 'none' }}>
            ← back
          </Link>
          <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>Chat</span>
        </div>
        {allGaps.length > 0 && (
          <Link href={`/expert/${expertId}/knowledge`} style={{ textDecoration: 'none' }}>
            <span style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              border: '1px solid rgba(232,160,74,0.3)',
              borderRadius: '2px',
              padding: '0.2rem 0.5rem',
            }}>
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
        marginBottom: '1.25rem',
      }}>
        {messages.length === 0 ? (
          <div style={{ paddingTop: '4rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            Ask anything — the wiki knows what it knows.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' ? (
                  /* User message — right-aligned, amber left border */
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(232,160,74,0.08)',
                      borderLeft: '2px solid var(--primary)',
                      borderRadius: '0 3px 3px 0',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* Assistant message — left-aligned, indented, typographic */
                  <div style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(240,239,232,0.08)' }}>
                    <div style={{
                      fontSize: '0.6875rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--muted-foreground)',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                    }}>
                      Wiki
                    </div>
                    <div style={{
                      fontSize: '0.9375rem',
                      lineHeight: 1.75,
                      color: 'var(--foreground)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                    {msg.gaps && msg.gaps.length > 0 && (
                      <div style={{
                        marginTop: '0.75rem',
                        fontSize: '0.75rem',
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
              <div style={{ paddingLeft: '1rem', borderLeft: '1px solid rgba(240,239,232,0.08)' }}>
                <div style={{
                  fontSize: '0.6875rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  marginBottom: '0.5rem',
                }}>Wiki</div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
                  {[0, 150, 300].map(delay => (
                    <span key={delay} className="animate-pulse" style={{
                      width: '5px', height: '5px',
                      borderRadius: '50%',
                      background: 'var(--muted-foreground)',
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
