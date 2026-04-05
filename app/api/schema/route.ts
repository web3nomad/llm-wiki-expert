import { NextRequest, NextResponse } from 'next/server';
import { getWikiContent, getExpert } from '@/lib/wiki-engine';
import { callLLM } from '@/lib/llm';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// GET: return current schema
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const expertId = searchParams.get('expertId');
  if (!expertId) return NextResponse.json({ error: 'expertId required' }, { status: 400 });

  const schemaPath = path.join(DATA_DIR, expertId, 'SCHEMA.md');
  if (!fs.existsSync(schemaPath)) {
    return NextResponse.json({ schema: null });
  }
  return NextResponse.json({ schema: fs.readFileSync(schemaPath, 'utf-8') });
}

// POST: generate or regenerate schema from current wiki content
export async function POST(request: NextRequest) {
  const { expertId } = await request.json();
  if (!expertId) return NextResponse.json({ error: 'expertId required' }, { status: 400 });

  const expert = await getExpert(expertId);
  if (!expert) return NextResponse.json({ error: 'Expert not found' }, { status: 404 });

  const wiki = await getWikiContent(expertId);

  const prompt = `You are generating a SCHEMA.md file for a personal LLM wiki about "${expert.name}".

This schema file tells the LLM how this wiki is structured and how to maintain it.
It should be specific to this expert's domain and the knowledge already in the wiki.

Current wiki sample:
${wiki.definitions.slice(0, 1500)}

Generate a SCHEMA.md that includes:
1. **Wiki Purpose** — what this wiki is for, what domain it covers
2. **Directory Structure** — the 4 concept files and what goes in each
   - concepts/definitions.md: core concepts, terminology, frameworks
   - concepts/entities.md: people, organizations, projects, tools
   - concepts/sources.md: source references and key facts
   - concepts/comparisons.md: relationships, trade-offs, contrasts
3. **Ingestion Rules** — how to process new sources (what to extract, how to merge)
4. **Query Rules** — how to answer questions (always cite sources, flag gaps)
5. **Maintenance Rules** — when to update existing entries vs add new ones

Keep it concise (under 400 words). Write it as a practical guide for the LLM.`;

  const schema = await callLLM(prompt, { temperature: 0.3, maxTokens: 1024 });
  const schemaPath = path.join(DATA_DIR, expertId, 'SCHEMA.md');
  fs.writeFileSync(schemaPath, schema);

  return NextResponse.json({ success: true, schema });
}
