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
  const [schema, setSchema] = useState<string | null>(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaSaving, setSchemaSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'definitions' | 'taxonomy' | 'connections' | 'gaps' | 'schema'>('definitions');
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
    loadSchema();
  }, [expertId]);

  const loadSchema = async () => {
    try {
      const res = await fetch(`/api/schema?expertId=${expertId}`);
      if (res.ok) {
        const data = await res.json();
        setSchema(data.schema || '');
      }
    } catch (e) { console.error(e); }
  };

  const handleGenerateSchema = async () => {
    setSchemaLoading(true);
    try {
      const res = await fetch('/api/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSchema(data.schema);
      }
    } catch (e) { console.error(e); }
    finally { setSchemaLoading(false); }
  };

  const handleSaveSchema = async () => {
    if (schema === null) return;
    setSchemaSaving(true);
    try {
      await fetch('/api/schema', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId, schema }),
      });
    } catch (e) { console.error(e); }
    finally { setSchemaSaving(false); }
  };

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
        body: JSON.stringify({ section: activeTab, content: content[activeTab as 'definitions' | 'taxonomy' | 'connections' | 'gaps'] }),
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
      <div style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="animate-pulse" style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem' }}>Loading knowledge base...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem', marginBottom: '1rem' }}>Failed to load knowledge base</p>
        <Link href={`/expert/${expertId}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
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
    { key: 'schema', label: 'Schema', icon: '⚙️' },
  ] as const;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href={`/expert/${expertId}`}
            style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textDecoration: 'none' }}
          >
            ← Back
          </Link>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--foreground)' }}>Knowledge Base</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/expert/${expertId}/graph`} className="btn btn-secondary btn-sm">
            Graph
          </Link>
          <Link href={`/expert/${expertId}/chat`} className="btn btn-primary btn-sm">
            Chat
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <style>{`
          @media (min-width: 1024px) {
            .knowledge-grid {
              grid-template-columns: 2fr 1fr;
            }
          }
        `}</style>
        <div className="knowledge-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '0.5rem 0.875rem',
                      fontSize: '0.8125rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: activeTab === tab.key ? 'var(--primary)' : 'transparent',
                      color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: activeTab === tab.key ? 500 : 400,
                    }}
                  >
                    {tab.label}
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

            {activeTab === 'schema' ? (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button onClick={handleGenerateSchema} disabled={schemaLoading} className="btn btn-secondary btn-sm">
                    {schemaLoading ? 'Generating...' : schema ? 'Regenerate' : 'Generate Schema'}
                  </button>
                  {schema && (
                    <button onClick={handleSaveSchema} disabled={schemaSaving} className="btn btn-primary btn-sm">
                      {schemaSaving ? 'Saving...' : 'Save Schema'}
                    </button>
                  )}
                </div>
                {schema === null ? (
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>No schema yet. Click Generate to create one from your wiki content.</p>
                ) : (
                  <textarea
                    className="textarea"
                    style={{ minHeight: '480px', fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                  />
                )}
              </div>
            ) : (
            <textarea
              className="textarea"
              style={{ minHeight: '480px', fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}
              value={content[activeTab as 'definitions' | 'taxonomy' | 'connections' | 'gaps']}
              onChange={(e) => setContent({ ...content, [activeTab]: e.target.value })}
            />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div className="card">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Import from URL</h3>
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
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Add Knowledge</h3>
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
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Gap Management</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem', lineHeight: 1.5 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>WikiScore</h3>
                <button onClick={loadScore} disabled={scoreLoading}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem' }}>
                  {scoreLoading ? 'Scoring...' : 'Score'}
                </button>
              </div>
              {wikiScore ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{Math.round(wikiScore.score * 100)}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>/ 100 · {wikiScore.label}</span>
                  </div>
                  <div style={{ width: '100%', background: 'var(--border)', borderRadius: '4px', height: '6px', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--primary)', height: '6px', borderRadius: '4px', width: `${wikiScore.score * 100}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                    {Object.entries(wikiScore.breakdown).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textTransform: 'capitalize' }}>{k}</span>
                        <span>{Math.round((v as number) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                  {wikiScore.summary && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginTop: '0.75rem', fontStyle: 'italic', lineHeight: 1.5 }}>{wikiScore.summary}</p>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>Click Score to evaluate wiki quality</p>
              )}
          </div>

            <div className="card">
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>Knowledge Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Definitions</span>
                  <span style={{ color: 'var(--foreground)' }}>{(content.definitions || "").split('\n').filter(l => l.trim()).length} items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Taxonomy</span>
                  <span style={{ color: 'var(--foreground)' }}>{(content.taxonomy || "").split('\n').filter(l => l.trim()).length} items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Connections</span>
                  <span style={{ color: 'var(--foreground)' }}>{(content.connections || "").split('\n').filter(l => l.trim()).length} items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted-foreground)' }}>Gaps</span>
                  <span style={{ color: '#d97706' }}>{(content.gaps || "").split('\n').filter(l => l.trim()).length} detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
