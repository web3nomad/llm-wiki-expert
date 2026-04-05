import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LLM Wiki Expert System',
  description: 'Create and chat with AI experts backed by wiki knowledge bases',
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
          <header className="border-b border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                🧠 Wiki Expert
              </Link>
              <nav className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  Experts
                </Link>
                <Link 
                  href="/create" 
                  className="btn btn-primary text-sm"
                >
                  Create Expert
                </Link>
              </nav>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
