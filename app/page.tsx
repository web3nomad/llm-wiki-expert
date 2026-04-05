import Link from 'next/link';
import { getExperts } from '@/lib/wiki-engine';

export default async function HomePage() {
  const experts = await getExperts();

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI Experts with Wiki Knowledge</h1>
        <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto">
          Create AI experts backed by dynamic wiki knowledge bases. 
          Chat with them, watch them learn, and help fill their knowledge gaps.
        </p>
      </div>

      {experts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-semibold mb-2">No experts yet</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Create your first AI expert to get started
          </p>
          <Link href="/create" className="btn btn-primary">
            Create Expert
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <Link 
              key={expert.id} 
              href={`/expert/${expert.id}`}
              className="card hover:border-[var(--primary)] transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                  {expert.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold group-hover:text-[var(--primary)] transition-colors truncate">
                    {expert.name}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mt-1">
                    {expert.bio}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="badge badge-primary">Chat</span>
                    <span className="badge badge-warning">Wiki</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-semibold mb-2">Wiki Knowledge Base</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Each expert has a markdown-based knowledge base that grows over time
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold mb-2">Interactive Chat</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Chat with experts and watch them learn from your conversations
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-semibold mb-2">Gap Detection</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            System identifies knowledge gaps and can auto-fill them
          </p>
        </div>
      </div>
    </div>
  );
}
