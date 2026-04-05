'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Expert {
  id: string;
  name: string;
  bio: string;
  createdAt: string;
}

export default function HomePage() {
  const [experts, setExperts] = useState<Expert[]>([]);

  useEffect(() => {
    fetch('/api/experts').then(r => r.json()).then(data => setExperts(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <div style={{ marginBottom: '4rem' }}>
        <p style={{
          fontSize: '0.8125rem',
          letterSpacing: '0.02em',
          color: 'var(--muted-foreground)',
          marginBottom: '1rem',
          fontWeight: 400,
        }}>
          Personal Knowledge System
        </p>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          color: 'var(--foreground)',
          marginBottom: '1.25rem',
          maxWidth: '40rem',
        }}>
          Knowledge that compounds,<br />not retrieval that repeats.
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'var(--muted-foreground)',
          maxWidth: '36rem',
          lineHeight: 1.65,
        }}>
          Create an expert, ingest sources, chat with a wiki that grows over time.
          Not RAG — a persistent, compounding knowledge base.
        </p>
      </div>

      {experts.length === 0 ? (
        <div style={{ paddingTop: '3rem' }}>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
            No experts yet. Create your first one.
          </p>
          <Link href="/create" className="btn btn-primary">
            Create Expert
          </Link>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '4rem',
          }}>
            {experts.map((expert) => (
              <Link
                key={expert.id}
                href={`/expert/${expert.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="expert-card" style={{
                  background: 'var(--card)',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  transition: 'border-color 0.2s ease',
                  cursor: 'pointer',
                  minHeight: '140px',
                }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: '1rem',
                  }}>
                    {expert.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 400,
                    color: 'var(--foreground)',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.01em',
                  }}>
                    {expert.name}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }}>
                    {expert.bio}
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/create" style={{ textDecoration: 'none' }}>
              <div className="new-expert-card" style={{
                background: 'transparent',
                padding: '1.5rem',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--muted-foreground)',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 300 }}>+</span>
                <span>New Expert</span>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* Footer note */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '2.5rem',
        display: 'flex',
        gap: '3rem',
      }}>
        {[
          { label: 'Explicit', desc: 'See exactly what the AI knows' },
          { label: 'Yours', desc: 'Plain markdown files, local' },
          { label: 'BYOAI', desc: 'Any OpenAI-compatible API' },
        ].map(item => (
          <div key={item.label}>
            <div style={{
              fontSize: '0.75rem',
              letterSpacing: '0.01em',
              color: 'var(--foreground)',
              fontWeight: 500,
              marginBottom: '0.375rem',
            }}>
              {item.label}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
