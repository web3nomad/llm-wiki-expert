import { NextRequest, NextResponse } from 'next/server';
import { getExpert, appendLog } from '@/lib/wiki-engine';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Save a chat answer back into the wiki as a new page
export async function POST(request: NextRequest) {
  const { expertId, question, answer, title } = await request.json();

  if (!expertId || !answer) {
    return NextResponse.json({ error: 'expertId and answer required' }, { status: 400 });
  }

  const expert = await getExpert(expertId);
  if (!expert) return NextResponse.json({ error: 'Expert not found' }, { status: 404 });

  const date = new Date().toISOString().slice(0, 10);
  const pageTitle = title || question?.slice(0, 60) || 'Saved insight';
  const slug = pageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40);

  const content = `# ${pageTitle}
*Filed: ${date}*
*Source: chat*

## Question
${question || '*(no question)*'}

## Answer
${answer}
`;

  // Save to concepts/insights/ directory
  const insightsDir = path.join(DATA_DIR, expertId, 'concepts', 'insights');
  if (!fs.existsSync(insightsDir)) fs.mkdirSync(insightsDir, { recursive: true });

  const filePath = path.join(insightsDir, `${date}-${slug}.md`);
  fs.writeFileSync(filePath, content);

  await appendLog(expertId, 'ingest', `[file-back] ${pageTitle}`);

  return NextResponse.json({ success: true, file: `concepts/insights/${date}-${slug}.md` });
}
