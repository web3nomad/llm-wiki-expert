import { NextRequest, NextResponse } from 'next/server';
import { addSource, autoFillGap, getWikiContent, getExpert } from '@/lib/wiki-engine';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expertId, content, type, title, action, conversation } = body;

    if (!expertId) {
      return NextResponse.json({ error: 'Expert ID is required' }, { status: 400 });
    }

    const expert = await getExpert(expertId);
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    // Handle auto-fill gaps
    if (action === 'autoFill') {
      const wiki = await getWikiContent(expertId);
      const gapLines = wiki.gaps.split('\n').filter(line => line.startsWith('## '));
      for (const gapLine of gapLines) {
        const gapTopic = gapLine.replace('## ', '').trim();
        await autoFillGap(expertId, gapTopic);
      }
      return NextResponse.json({ success: true, filledCount: gapLines.length });
    }

    // Handle conversation import
    if (action === 'importConversation' && conversation) {
      const messages = Array.isArray(conversation) ? conversation : [];
      const formatted = messages.map((m: {role: string, content: string}) =>
        `[${m.role.toUpperCase()}]: ${m.content}`
      ).join('\n\n');
      const sourceText = `# Conversation Import\n\n${formatted}`;
      await addSource(expertId, sourceText);
      return NextResponse.json({ success: true, source: 'conversation' });
    }

    // Handle URL ingest
    if (type === 'url' && content) {
      // Fetch URL via fetch-url API logic inline
      try {
        const fetchRes = await fetch(`http://localhost:${process.env.PORT || 3000}/api/fetch-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: content }),
        });
        if (fetchRes.ok) {
          const { text } = await fetchRes.json();
          await addSource(expertId, text);
        } else {
          // Fall back to raw URL as text
          await addSource(expertId, `Source URL: ${content}`);
        }
      } catch {
        await addSource(expertId, `Source URL: ${content}`);
      }
      return NextResponse.json({ success: true });
    }

    // Handle text ingest (default)
    if (content) {
      await addSource(expertId, content);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No content or action provided' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to ingest content' }, { status: 500 });
  }
}
