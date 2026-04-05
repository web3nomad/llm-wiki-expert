import { NextRequest, NextResponse } from 'next/server';
import { addSource, getWikiContent, updateWikiContent, getExpert } from '@/lib/wiki-engine';
import { callLLM } from '@/lib/llm';

const CHUNK_SIZE = 4000;

// Split long text into overlapping chunks to preserve context at boundaries
function chunkText(text: string, chunkSize = CHUNK_SIZE): string[] {
  if (text.length <= chunkSize) return [text];
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - 400; // 400-char overlap
  }
  return chunks;
}

// Extract knowledge from each chunk, then merge with a final LLM pass
// Strategy 2: recursive summary tree (h/t @antilukalister)
// Convert to sections → summarize each → meta-summary
// Better for preserving document structure
async function extractWithSummaryTree(text: string, url: string): Promise<string> {
  // Split by natural section boundaries (double newlines, heading patterns)
  const sections = text.split(/\n\n+/).filter(s => s.trim().length > 100);
  if (sections.length <= 3) {
    return callLLM(
      `Extract key knowledge from this web page for a wiki.\nSource: ${url}\n\n${text}`,
      { maxTokens: 2048, temperature: 0.3 }
    );
  }
  // Summarize each section
  const summaries = await Promise.all(
    sections.slice(0, 12).map(section =>
      callLLM(`One-sentence summary of key fact/insight:\n${section}`, { maxTokens: 100, temperature: 0.2 })
    )
  );
  // Meta-summary into wiki entry
  return callLLM(
    `Turn these section summaries into a structured wiki entry.\nSource: ${url}\n\n${summaries.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    { maxTokens: 2048, temperature: 0.3 }
  );
}

async function extractWithChunking(text: string, url: string): Promise<string> {
  const chunks = chunkText(text);
  if (chunks.length === 1) {
    return callLLM(
      `Extract key knowledge and insights from this web page. Format as clean markdown for a wiki.\nSource: ${url}\n\n${text}`,
      { maxTokens: 2048, temperature: 0.3 }
    );
  }
  // Process each chunk
  const partials = await Promise.all(
    chunks.map((chunk, i) =>
      callLLM(
        `Extract key facts and insights from this section (${i + 1}/${chunks.length}) of a web page.\nSource: ${url}\n\n${chunk}`,
        { maxTokens: 1024, temperature: 0.3 }
      )
    )
  );
  // Final merge pass
  return callLLM(
    `Merge these ${chunks.length} partial extracts from the same page into one clean wiki entry. Remove duplicates, keep structure.\nSource: ${url}\n\n${partials.map((p, i) => `## Part ${i + 1}\n${p}`).join('\n\n')}`,
    { maxTokens: 2048, temperature: 0.3 }
  );
}

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

    // Use summary tree for structured docs (>3 sections), chunking for dense text
    const sections = text.split(/\n\n+/).filter(s => s.trim().length > 100);
    const extracted = sections.length > 3
      ? await extractWithSummaryTree(text, url)
      : await extractWithChunking(text, url);

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
