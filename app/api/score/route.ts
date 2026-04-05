import { NextRequest, NextResponse } from 'next/server';
import { getWikiContent, getExpert } from '@/lib/wiki-engine';
import { callLLM } from '@/lib/llm';

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

  // Count entries
  const definitionEntries = (wiki.definitions.match(/^##\s+/gm) || []).length;
  const entityEntries = (wiki.entities.match(/^##\s+/gm) || []).length;
  const totalEntries = definitionEntries + entityEntries;

  if (totalEntries === 0) {
    return NextResponse.json({
      score: 0,
      label: 'Empty',
      breakdown: { completeness: 0, coverage: 0, coherence: 0 },
      summary: 'No knowledge ingested yet.',
      entries: 0,
    });
  }

  // Ask LLM to score the wiki quality
  const scorePrompt = `You are evaluating a personal knowledge wiki. Score it on three dimensions.

== DEFINITIONS ==
${wiki.definitions.slice(0, 2000)}

== ENTITIES ==
${wiki.entities.slice(0, 1000)}

== COMPARISONS ==
${wiki.comparisons.slice(0, 1000)}

== GAPS ==
${wiki.gaps.slice(0, 500)}

Score each dimension from 0.0 to 1.0:
1. completeness: Are definitions thorough, not just stubs?
2. coverage: Are there diverse concepts, entities, comparisons?
3. coherence: Is the knowledge interconnected and consistent?

Reply in this exact JSON format (no markdown, no extra text):
{"completeness": 0.0, "coverage": 0.0, "coherence": 0.0, "summary": "one sentence assessment"}`;

  let breakdown = { completeness: 0.5, coverage: 0.5, coherence: 0.5 };
  let summary = '';

  try {
    const raw = await callLLM(scorePrompt, { temperature: 0.2, maxTokens: 256 });
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    breakdown = {
      completeness: Math.min(1, Math.max(0, parsed.completeness || 0.5)),
      coverage: Math.min(1, Math.max(0, parsed.coverage || 0.5)),
      coherence: Math.min(1, Math.max(0, parsed.coherence || 0.5)),
    };
    summary = parsed.summary || '';
  } catch {
    // fallback to simple heuristic
    breakdown.coverage = Math.min(1, totalEntries / 20);
  }

  const score = (breakdown.completeness + breakdown.coverage + breakdown.coherence) / 3;

  const label =
    score >= 0.8 ? 'Expert' :
    score >= 0.6 ? 'Solid' :
    score >= 0.4 ? 'Growing' :
    score >= 0.2 ? 'Sparse' : 'Seedling';

  return NextResponse.json({
    score: Math.round(score * 100) / 100,
    label,
    breakdown,
    summary,
    entries: totalEntries,
  });
}
