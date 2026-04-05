import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || 'https://api.ppio.com/openai/v1',
  apiKey: process.env.LLM_API_KEY || '',
});

export interface LLMResponse {
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Call the LLM with a prompt and get the response
 */
export async function callLLM(
  prompt: string,
  options?: {
    system?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  const model = options?.model || process.env.LLM_MODEL || 'minimax/minimax-m2.5';
  const maxTokens = options?.maxTokens || 4096;
  const temperature = options?.temperature || 0.7;

  const response = await openai.chat.completions.create({
    model,
    max_tokens: maxTokens,
    temperature,
    messages: [
      {
        role: 'system',
        content: options?.system || 'You are a helpful AI assistant.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No text content in LLM response');
  }

  return content;
}

/**
 * Generate an extract from source content - summarizes key points, entities, etc.
 */
export async function generateExtract(sourceContent: string): Promise<{
  summary: string;
  keyPoints: string[];
  entities: string[];
}> {
  const prompt = `Analyze the following content and provide a structured extract.

SOURCE CONTENT:
${sourceContent}

Respond in the following JSON format (no additional text):
{
  "summary": "A 2-3 sentence summary of the main points",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "entities": ["Entity 1", "Entity 2", "Entity 3"]
}`;

  const response = await callLLM(prompt, {
    maxTokens: 2048,
    temperature: 0.3,
  });

  try {
    // Try to parse JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || '',
        keyPoints: parsed.keyPoints || [],
        entities: parsed.entities || [],
      };
    }
  } catch (e) {
    // If JSON parsing fails, return defaults
  }

  return {
    summary: response.substring(0, 200),
    keyPoints: [],
    entities: [],
  };
}

/**
 * Update concepts incrementally by merging new content with existing
 */
export async function updateConceptsWithLLM(
  existingContent: string,
  newExtracts: string[],
  conceptType: 'definitions' | 'entities' | 'sources' | 'comparisons'
): Promise<string> {
  const prompt = `You are maintaining a knowledge wiki. Incrementally update the existing concept file by merging new information.

EXISTING CONCEPT FILE (${conceptType}):
${existingContent}

NEW EXTRACTS FROM SOURCES:
${newExtracts.map((e, i) => `--- Extract ${i + 1} ---\n${e}`).join('\n\n')}

TASK:
1. Merge the new information into the existing content
2. Update and improve existing entries where relevant
3. Add new entries from the extracts
4. Keep the format consistent with the existing content
5. Do NOT replace existing content - only enhance and update it

Respond with the complete updated content in markdown format.`;

  return callLLM(prompt, {
    maxTokens: 4096,
    temperature: 0.4,
  });
}

/**
 * Generate a response using wiki context
 */
export async function generateWikiResponse(
  userMessage: string,
  wikiContext: {
    definitions: string;
    entities: string;
    sources: string;
    comparisons: string;
    gaps: string;
    expertName: string;
    expertBio: string;
  }
): Promise<{
  response: string;
  detectedGaps: string[];
}> {
  const systemPrompt = `You are ${wikiContext.expertName}, an AI expert. ${wikiContext.expertBio}

You have a knowledge base that you've built from various sources. Use this knowledge to answer questions accurately and thoroughly.

When answering:
1. Draw from your knowledge base (definitions, entities, sources, comparisons)
2. Be specific and cite relevant information
3. If you're unsure about something, acknowledge it
4. If you notice gaps in your knowledge, note them

Your knowledge base:
${'-'.repeat(50)}
DEFINITIONS:
${wikiContext.definitions}

ENTITIES:
${wikiContext.entities}

SOURCES:
${wikiContext.sources}

COMPARISONS:
${wikiContext.comparisons}

KNOWN GAPS:
${wikiContext.gaps}
${'-'.repeat(50)}`;

  const prompt = `User question: ${userMessage}

Respond to the user's question based on your knowledge base. If you need to acknowledge uncertainty or identify gaps, include them in your response.

Format your response as JSON:
{
  "response": "Your answer to the user",
  "gaps": ["gap1", "gap2"] // Any knowledge gaps you notice while answering
}`;

  const response = await callLLM(prompt, {
    system: systemPrompt,
    maxTokens: 2048,
    temperature: 0.7,
  });

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        response: parsed.response || response,
        detectedGaps: parsed.gaps || [],
      };
    }
  } catch (e) {
    // Fallback
  }

  return {
    response,
    detectedGaps: [],
  };
}

/**
 * Generate knowledge content to fill a gap
 */
export async function generateGapContent(
  gapTopic: string,
  expertContext: {
    name: string;
    bio: string;
    definitions: string;
    entities: string;
  }
): Promise<string> {
  const prompt = `Generate comprehensive knowledge content about "${gapTopic}" for an expert named ${expertContext.name}.

Expert background: ${expertContext.bio}

Current knowledge base:
${expertContext.definitions}

${expertContext.entities}

Generate detailed content about ${gapTopic} that would help expand this expert's knowledge. Include:
- Definition/overview
- Key concepts
- Important details
- Connections to existing knowledge

Respond in markdown format.`;

  return callLLM(prompt, {
    maxTokens: 4096,
    temperature: 0.5,
  });
}
