import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExpert, getWikiContent } from '@/lib/wiki-engine';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExpertProfilePage({ params }: Props) {
  const { id } = await params;
  const expert = await getExpert(id);
  
  if (!expert) {
    notFound();
  }

  const wiki = await getWikiContent(id);

  return (
    <div className="animate-fade-in">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        ← Back to experts
      </Link>

      <div className="card mb-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
            {expert.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{expert.name}</h1>
            <p className="text-[var(--muted-foreground)] mb-4">{expert.bio}</p>
            <div className="flex gap-3">
              <Link href={`/expert/${id}/chat`} className="btn btn-primary">
                💬 Chat
              </Link>
              <Link href={`/expert/${id}/knowledge`} className="btn btn-secondary">
                📚 Knowledge Base
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">📖 Knowledge Preview</h2>
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Definitions</h3>
              <div className="text-sm whitespace-pre-wrap">{wiki.definitions.slice(0, 500)}{wiki.definitions.length > 500 ? '...' : ''}</div>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Taxonomy</h3>
              <div className="text-sm whitespace-pre-wrap">{wiki.taxonomy.slice(0, 300)}{wiki.taxonomy.length > 300 ? '...' : ''}</div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Known Gaps</h3>
              <div className="text-sm text-[var(--muted-foreground)]">{wiki.gaps.includes('##') ? wiki.gaps.slice(0, 300) : 'No gaps detected yet'}</div>
            </div>
          </div>
          <Link href={`/expert/${id}/knowledge`} className="btn btn-ghost mt-4 w-full">
            View Full Knowledge Base →
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
          <div className="space-y-3">
            <Link 
              href={`/expert/${id}/chat`}
              className="block p-4 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] transition-colors"
            >
              <div className="font-medium">Start a Conversation</div>
              <div className="text-sm text-[var(--muted-foreground)]">Chat with {expert.name} and discover knowledge gaps</div>
            </Link>
            <Link 
              href={`/expert/${id}/knowledge`}
              className="block p-4 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] transition-colors"
            >
              <div className="font-medium">Manage Knowledge</div>
              <div className="text-sm text-[var(--muted-foreground)]">Add sources, edit concepts, review gaps</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
