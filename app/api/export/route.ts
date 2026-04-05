import { NextRequest, NextResponse } from 'next/server';
import { getWikiContent, getExpert } from '@/lib/wiki-engine';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const expertId = searchParams.get('expertId');

  if (!expertId) {
    return NextResponse.json({ error: 'expertId required' }, { status: 400 });
  }

  const expert = await getExpert(expertId);
  if (!expert) {
    return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
  }

  const wiki = await getWikiContent(expertId);

  // Obsidian-compatible markdown bundle
  const files: Record<string, string> = {
    [`${expert.name}/README.md`]: `---
name: ${expert.name}
created: ${expert.createdAt}
tags: [wiki-expert, llm-knowledge-base]
---

# ${expert.name}

${expert.bio}

## Knowledge Base

- [[definitions]] — Core concepts and definitions
- [[sources]] — Source documents
- [[connections]] — Relationships between concepts
- [[gaps]] — Knowledge gaps detected
`,
    [`${expert.name}/definitions.md`]: `---\ntags: [definitions]\n---\n\n${wiki.definitions}`,
    [`${expert.name}/sources.md`]: `---\ntags: [sources]\n---\n\n${wiki.sources}`,
    [`${expert.name}/connections.md`]: `---\ntags: [connections]\n---\n\n${wiki.connections}`,
    [`${expert.name}/gaps.md`]: `---\ntags: [gaps]\n---\n\n${wiki.gaps}`,
  };

  return NextResponse.json({
    expert: expert.name,
    files,
    exportedAt: new Date().toISOString(),
    note: 'Drop these files into your Obsidian vault. [[wiki links]] work out of the box.',
  });
}
