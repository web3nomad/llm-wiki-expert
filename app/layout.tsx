import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LLM Wiki Expert',
  description: 'Personal knowledge bases powered by LLMs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header style={{ borderBottom: '1px solid var(--border)' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  color: 'var(--foreground)',
                }}>
                  LLM Wiki Expert
                </span>
              </Link>
              <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link
                  href="/"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--muted-foreground)',
                    textDecoration: 'none',
                  }}
                >
                  Experts
                </Link>
                <Link href="/create" className="btn btn-primary btn-sm">
                  New Expert
                </Link>
              </nav>
            </div>
          </header>
          <main style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
