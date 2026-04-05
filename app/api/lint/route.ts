import { NextRequest, NextResponse } from 'next/server';
import { getWikiContent, getExpert, appendLog } from '@/lib/wiki-engine';
import { callLLM } from '@/lib/llm';

export async function POST(request: NextRequest) {
  const { expertId } = await request.json();

  if (!expertId) {
    return NextResponse.json({ error: 'expertId required' }, { status: 400 });
  }

  const expert = await getExpert(expertId);
  if (!expert) {
    return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
  }

  const wiki = await getWikiContent(expertId);

  const lintPrompt = `You are a wiki health inspector. Analyze this personal knowledge wiki and find issues.

== DEFINITIONS ==
${wiki.definitions.slice(0, 2000)}

== ENTITIES ==
${wiki.entities.slice(0, 1000)}

== COMPARISONS ==
${wiki.comparisons.slice(0, 800)}

== KNOWN GAPS ==
${wiki.gaps.slice(0, 500)}

Find and report:
1. Contradictions between pages
2. Orphaned concepts (mentioned but no definition)
3. Stale or vague claims that need updating
4. Missing cross-references between related concepts
5. Knowledge gaps worth investigating

Reply ONLY with valid JSON, no markdown fences, no extra text. Keep each array to max 3 items, each item under 100 chars:
{
  "contradictions": ["..."],
  "orphans": ["..."],
  "stale": ["..."],
  "missing_links": ["..."],
  "gaps_to_fill": ["..."],
  "health_summary": "one sentence"
}`;

  try {
    const raw = await callLLM(lintPrompt, { temperature: 0.2, maxTokens: 2048 });
    const report = JSON.parse(raw.replace(/```json|```/g, '').trim());

    await appendLog(expertId, 'lint', `health check — ${report.health_summary || 'done'}`);

    return NextResponse.json({ success: true, report });
  } catch (e) {
    return NextResponse.json({ error: 'Lint failed', detail: String(e) }, { status: 500 });
  }
}
