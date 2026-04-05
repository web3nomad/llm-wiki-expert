'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface WikiContent {
  definitions: string;
  taxonomy: string;
  connections: string;
  gaps: string;
}

export default function KnowledgePage() {
  const params = useParams();
  const expertId = params.id as string;
  const [content, setContent] = useState<WikiContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'definitions' | 'taxonomy' | 'connections' | 'gaps'>('definitions');
  const [newSource, setNewSource] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [wikiScore, setWikiScore] = useState<{
    score: number; label: string;
    breakdown: { completeness: number; coverage: number; coherence: number };
    summary: string; entries: number;
  } | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  useEffect(() => {
    loadWiki();
  }, [expertId]);

  const loadScore = async () => {
    setScoreLoading(true);
    try {
      const res = await fetch(`/api/score?expertId=${expertId}`);
      if (res.ok) setWikiScore(await res.json());
    } catch (e) { console.error(e); }
    finally { setScoreLoading(false); }
  };

  const loadWiki = async () => {
    try {
      const res = await fetch(`/api/experts/${expertId}/wiki`);
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await fetch(`/api/experts/${expertId}/wiki`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activeTab, content: content[activeTab] }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSource.trim()) return;
    try {
      await fetch(`/api/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId, content: newSource }),
      });
      setNewSource('');
      loadWiki();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAutoFillGaps = async () => {
    setSaving(true);
    try {
      await fetch(`/api/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId, action: 'autoFill', content: '' }),
      });
      loadWiki();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading knowledge base...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--muted-foreground)]">Failed to load knowledge base</p>
        <Link href={`/expert/${expertId}`} className="text-[var(--primary)] mt-2 inline-block">
          Back to profile
        </Link>
      </div>
    );
  }

  const tabs = [
    { key: 'definitions', label: 'Definitions', icon: '📖' },
    { key: 'taxonomy', label: 'Taxonomy', icon: '🌳' },
    { key: 'connections', label: 'Connections', icon: '🔗' },
    { key: 'gaps', label: 'Gaps', icon: '🔍' },
  ] as const;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href={`/expert/${expertId}`}
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ← Back to profile
          </Link>
          <h1 className="text-xl font-semibold">Knowledge Base</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/expert/${expertId}/graph`} className="btn btn-secondary btn-sm">
            🕸️ Graph
          </Link>
          <Link href={`/expert/${expertId}/chat`} className="btn btn-primary btn-sm">
            💬 Chat
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-secondary btn-sm"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>

            <textarea
              className="textarea min-h-[400px] font-mono text-sm"
              value={content[activeTab]}
              onChange={(e) => setContent({ ...content, [activeTab]: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">🔗 Import from URL</h3>
            <input
              className="input mb-3 w-full"
              placeholder="https://... paste any article, blog post, or tweet"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button
              onClick={async () => {
                if (!urlInput.trim()) return;
                setUrlLoading(true);
                try {
                  await fetch('/api/fetch-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ expertId: expertId, url: urlInput.trim() }),
                  });
                  setUrlInput('');
                  // refresh wiki content
                  const r = await fetch(`/api/experts/${expertId}/wiki`);
                  const d = await r.json();
                  setContent(d);
                } finally {
                  setUrlLoading(false);
                }
              }}
              disabled={!urlInput.trim() || urlLoading}
              className="btn btn-primary w-full"
            >
              {urlLoading ? 'Fetching...' : 'Import URL'}
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">📥 Add Knowledge</h3>
            <textarea
              className="textarea mb-3"
              placeholder="Paste content or notes to add to the knowledge base..."
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              rows={4}
            />
            <button
              onClick={handleAddSource}
              disabled={!newSource.trim()}
              className="btn btn-primary w-full"
            >
              Ingest Content
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">🔧 Gap Management</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Automatically generate content to fill detected knowledge gaps.
            </p>
            <button
              onClick={handleAutoFillGaps}
              disabled={saving}
              className="btn btn-secondary w-full"
            >
              {saving ? 'Processing...' : 'Auto-Fill Gaps'}
            </button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">🏆 WikiScore</h3>
              <button onClick={loadScore} disabled={scoreLoading}
                className="btn btn-secondary btn-sm text-xs">
                {scoreLoading ? 'Scoring...' : 'Score'}
              </button>
            </div>
            {wikiScore ? (
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold">{Math.round(wikiScore.score * 100)}</span>
                  <span className="text-sm text-[var(--muted-foreground)] mb-1">/ 100 · {wikiScore.label}</span>
                </div>
                <div className="w-full bg-[var(--secondary)] rounded-full h-1.5 mb-3">
                  <div className="bg-[var(--primary)] h-1.5 rounded-full transition-all"
                    style={{ width: `${wikiScore.score * 100}%` }} />
                </div>
                <div className="space-y-1 text-xs text-[var(--muted-foreground)]">
                  {Object.entries(wikiScore.breakdown).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="capitalize">{k}</span>
                      <span>{Math.round((v as number) * 100)}%</span>
                    </div>
                  ))}
                </div>
                {wikiScore.summary && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-2 italic">{wikiScore.summary}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)]">Click Score to evaluate wiki quality</p>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">📊 Knowledge Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Definitions</span>
                <span>{(content.definitions || "").split('\n').filter(l => l.trim()).length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Taxonomy</span>
                <span>{(content.taxonomy || "").split('\n').filter(l => l.trim()).length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Connections</span>
                <span>{(content.connections || "").split('\n').filter(l => l.trim()).length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Gaps</span>
                <span className="text-yellow-500">{(content.gaps || "").split('\n').filter(l => l.trim()).length} detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
