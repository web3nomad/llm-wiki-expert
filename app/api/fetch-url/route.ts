import { NextRequest, NextResponse } from 'next/server';
import { addSource, getWikiContent, updateWikiContent, getExpert } from '@/lib/wiki-engine';
import { callLLM } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const { expertId, url } = await request.json();

    if (!expertId || !url) {
      return NextResponse.json({ error: 'expertId and url are required' }, { status: 400 });
    }

    const expert = await getExpert(expertId);
    if (!expert) {
      return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
    }

    // Fetch the URL content
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LLMWikiBot/1.0)' },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${res.status}` }, { status: 400 });
    }

    const html = await res.text();

    // Strip HTML tags to get plain text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000); // limit to avoid token overflow

    // Ask LLM to extract key knowledge from the page
    const extracted = await callLLM(
      `Extract the key knowledge, insights, and facts from this web page content. 
Format as clean markdown suitable for a wiki knowledge base.
Source URL: ${url}

PAGE CONTENT:
${text}`,
      { maxTokens: 2048, temperature: 0.3 }
    );

    // Add to wiki
    const sourceContent = `# From URL: ${url}\n\n${extracted}`;
    await addSource(expertId, sourceContent);
    const wiki = await getWikiContent(expertId);
    await updateWikiContent(
      expertId,
      'definitions',
      wiki.definitions + `\n\n## From ${new URL(url).hostname} (${new Date().toISOString().split('T')[0]})\n\n${extracted}`
    );

    return NextResponse.json({ success: true, url, extracted: extracted.slice(0, 200) + '...' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch and ingest URL' }, { status: 500 });
  }
}
