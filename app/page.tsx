import Link from 'next/link';
import { getExperts } from '@/lib/wiki-engine';

export default async function HomePage() {
  const experts = await getExperts();

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <div style={{ marginBottom: '4rem' }}>
        <p style={{
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--primary)',
          marginBottom: '1.25rem',
          fontWeight: 500,
        }}>
          Personal Knowledge System
        </p>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--foreground)',
          marginBottom: '1rem',
          maxWidth: '36rem',
        }}>
          Knowledge that compounds,<br />not retrieval that repeats.
        </h1>
        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--muted-foreground)',
          maxWidth: '32rem',
          lineHeight: 1.7,
        }}>
          Create an expert, ingest sources, chat with a wiki that grows over time.
          Not RAG — a persistent, compounding knowledge base.
        </p>
      </div>

      {experts.length === 0 ? (
        <div style={{ paddingTop: '2rem' }}>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            border: '1px solid rgba(240,239,232,0.08)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '3rem',
          }}>
            {experts.map((expert) => (
              <Link
                key={expert.id}
                href={`/expert/${expert.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'var(--card)',
                  padding: '1.5rem',
                  borderRight: '1px solid rgba(240,239,232,0.08)',
                  borderBottom: '1px solid rgba(240,239,232,0.08)',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                  minHeight: '120px',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1a1a17')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--card)')}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '3px',
                    background: 'rgba(232,160,74,0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    marginBottom: '0.875rem',
                    letterSpacing: '0.02em',
                  }}>
                    {expert.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    color: 'var(--foreground)',
                    marginBottom: '0.375rem',
                    letterSpacing: '-0.01em',
                  }}>
                    {expert.name}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
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
              <div style={{
                background: 'transparent',
                padding: '1.5rem',
                cursor: 'pointer',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--muted-foreground)',
                fontSize: '0.8125rem',
                transition: 'color 0.15s',
                borderRight: '1px solid rgba(240,239,232,0.08)',
                borderBottom: '1px solid rgba(240,239,232,0.08)',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}
              >
                <span style={{ fontSize: '1rem' }}>+</span>
                <span>New Expert</span>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* Footer note */}
      <div style={{
        borderTop: '1px solid rgba(240,239,232,0.06)',
        paddingTop: '2rem',
        display: 'flex',
        gap: '2rem',
      }}>
        {[
          { label: 'Explicit', desc: 'See exactly what the AI knows' },
          { label: 'Yours', desc: 'Plain markdown files, local' },
          { label: 'BYOAI', desc: 'Any OpenAI-compatible API' },
        ].map(item => (
          <div key={item.label}>
            <div style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              fontWeight: 500,
              marginBottom: '0.25rem',
            }}>
              {item.label}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
