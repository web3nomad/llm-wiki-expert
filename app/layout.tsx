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
          <header style={{ borderBottom: '1px solid rgba(240,239,232,0.08)' }}>
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" style={{ textDecoration: 'none' }}>
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--foreground)',
                  opacity: 0.9,
                }}>
                  LLM Wiki Expert
                </span>
              </Link>
              <nav className="flex items-center gap-6">
                <Link
                  href="/"
                  style={{
                    fontSize: '0.8125rem',
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
          <main className="max-w-5xl mx-auto px-6 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
