import { NextRequest, NextResponse } from 'next/server';
import { getWikiContent, getExpert, appendLog, updateWikiContent } from '@/lib/wiki-engine';
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
1. Contradictions between pages (be specific: what claim conflicts with what)
2. Orphaned concepts (mentioned but no definition)
3. Stale or vague claims that need updating
4. Missing cross-references between related concepts
5. Knowledge gaps worth investigating

For contradictions, use this format:
{
  "claim": "the contested claim",
  "evidence_for": "what supports it",
  "evidence_against": "what contradicts it",
  "resolution": "open|resolved|nuanced"
}

Reply ONLY with valid JSON, no markdown fences, no extra text. Keep each array to max 3 items:
{
  "contradictions": [{"claim": "...", "evidence_for": "...", "evidence_against": "...", "resolution": "open"}],
  "orphans": ["..."],
  "stale": ["..."],
  "missing_links": ["..."],
  "gaps_to_fill": ["..."],
  "health_summary": "one sentence"
}`;

  try {
    const raw = await callLLM(lintPrompt, { temperature: 0.2, maxTokens: 2048 });
    const report = JSON.parse(raw.replace(/```json|```/g, '').trim());

    // File contradictions back into comparisons.md as structured entries
    if (report.contradictions && report.contradictions.length > 0) {
      const date = new Date().toISOString().slice(0, 10);
      const contradictionEntries = report.contradictions
        .filter((c: { claim?: string; evidence_for?: string; evidence_against?: string; resolution?: string } | string) => typeof c === 'object' && c.claim)
        .map((c: { claim: string; evidence_for?: string; evidence_against?: string; resolution?: string }) => `
## Contradiction: ${c.claim}
*Detected: ${date} | Status: ${c.resolution || 'open'}*

**Evidence for:** ${c.evidence_for || '—'}

**Evidence against:** ${c.evidence_against || '—'}

**Resolution:** ${c.resolution === 'resolved' ? 'Resolved' : c.resolution === 'nuanced' ? 'Nuanced — both may be true in different contexts' : 'Open — needs investigation'}
`)
        .join('\n');

      if (contradictionEntries.trim()) {
        const updatedComparisons = wiki.comparisons + '\n\n---\n# Detected Contradictions\n' + contradictionEntries;
        await updateWikiContent(expertId, 'comparisons', updatedComparisons);
      }
    }

    await appendLog(expertId, 'lint', `health check — ${report.health_summary || 'done'}`);

    return NextResponse.json({ success: true, report });
  } catch (e) {
    return NextResponse.json({ error: 'Lint failed', detail: String(e) }, { status: 500 });
  }
}
