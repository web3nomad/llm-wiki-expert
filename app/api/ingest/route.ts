import { NextRequest, NextResponse } from 'next/server';
import { addSource, getWikiContent, updateWikiContent, autoFillGap, getExpert } from '@/lib/wiki-engine';
import { callLLM } from '@/lib/llm';

// Convert AI conversation format into wiki-ready source content
function formatConversation(messages: {role: string, content: string}[]): string {
  const formatted = messages
    .map(m => `[${m.role.toUpperCase()}]: ${m.content}`)
    .join('\n\n');
  return `# Conversation Import\n\n${formatted}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expertId, content, action, conversation } = body;

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
        // Only fill unfilled gaps
        if (!wiki.gaps.includes(`Status: Filled`) || !wiki.gaps.includes(gapTopic)) {
          await autoFillGap(expertId, gapTopic);
        }
      }
      
      return NextResponse.json({ success: true, filledCount: gapLines.length });
    }

    // Handle conversation import (AI conversation → wiki)
    if (action === 'importConversation' && conversation) {
      const formatted = formatConversation(conversation);
      // Ask LLM to extract key insights from the conversation
      const extracted = await callLLM(
        `Extract the key knowledge, insights, and facts from this AI conversation. Format as clean markdown suitable for a wiki knowledge base.\n\n${formatted}`,
        { maxTokens: 2048, temperature: 0.3 }
      );
      await addSource(expertId, extracted);
      const wiki = await getWikiContent(expertId);
      await updateWikiContent(expertId, 'definitions', wiki.definitions + `\n\n## From conversation (${new Date().toISOString().split('T')[0]})\n\n${extracted}`);
      return NextResponse.json({ success: true, source: 'conversation' });
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
