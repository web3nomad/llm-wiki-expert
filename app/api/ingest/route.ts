import { NextRequest, NextResponse } from 'next/server';
import { addSource, getWikiContent, updateWikiContent, autoFillGap, getExpert } from '@/lib/wiki-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expertId, content, action } = body;

    if (!expertId) {
      return NextResponse.json({ error: 'Expert ID is required' }, { status: 400 });
    }

    const expert = await getExpert(expertId);
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    // Handle auto-fill gaps action
    if (action === 'autoFill') {
      const wiki = await getWikiContent(expertId);
      
      // Parse gaps from the gaps.md file
      const gapLines = wiki.gaps.split('\n').filter(line => line.startsWith('## '));
      
      for (const gapLine of gapLines) {
        const gapTopic = gapLine.replace('## ', '').trim();
        await autoFillGap(expertId, {
          topic: gapTopic,
          description: `Auto-filled knowledge for: ${gapTopic}`,
          detectedAt: new Date().toISOString(),
        });
      }
      
      return NextResponse.json({ success: true, filledCount: gapLines.length });
    }

    // Handle content ingestion
    if (content) {
      await addSource(expertId, content);
      
      // Update definitions with new content (simplified - real impl would use LLM)
      const wiki = await getWikiContent(expertId);
      const newDefinition = `\n\n## ${content.slice(0, 50)}...\n\n${content}`;
      await updateWikiContent(expertId, 'definitions', wiki.definitions + newDefinition);
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No content or action provided' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to ingest content' }, { status: 500 });
  }
}
