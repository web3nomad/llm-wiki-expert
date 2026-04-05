import fs from 'fs';
import path from 'path';
import {
  callLLM,
  generateExtract,
  updateConceptsWithLLM,
  generateWikiResponse,
  generateGapContent,
} from './llm';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface Expert {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface KnowledgeGap {
  topic: string;
  description: string;
  detectedAt: string;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Ensure expert directory exists with proper structure
function ensureExpertDir(expertId: string) {
  const expertDir = path.join(DATA_DIR, expertId);
  const subdirs = ['sources', 'concepts'];

  if (!fs.existsSync(expertDir)) {
    fs.mkdirSync(expertDir, { recursive: true });
    subdirs.forEach((subdir) => {
      fs.mkdirSync(path.join(expertDir, subdir), { recursive: true });
    });
  }

  return expertDir;
}

// Expert CRUD operations
export async function getExperts(): Promise<Expert[]> {
  ensureDataDir();
  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  const experts: Expert[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const metaPath = path.join(DATA_DIR, entry.name, 'meta.json');
      if (fs.existsSync(metaPath)) {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        experts.push(meta);
      }
    }
  }

  return experts;
}

export async function getExpert(id: string): Promise<Expert | null> {
  const metaPath = path.join(DATA_DIR, id, 'meta.json');
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
}

export async function createExpert(data: Omit<Expert, 'id' | 'createdAt'>): Promise<Expert> {
  const id = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const expertDir = ensureExpertDir(id);

  const expert: Expert = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };

  // Write meta.json
  fs.writeFileSync(
    path.join(expertDir, 'meta.json'),
    JSON.stringify(expert, null, 2)
  );

  // Initialize wiki files with proper structure
  fs.writeFileSync(
    path.join(expertDir, 'concepts', 'definitions.md'),
    '# Definitions\n\nThis expert\'s knowledge definitions.\n'
  );
  fs.writeFileSync(
    path.join(expertDir, 'concepts', 'entities.md'),
    '# Entities\n\nNamed entities, people, topics, and organizations.\n'
  );
  fs.writeFileSync(
    path.join(expertDir, 'concepts', 'sources.md'),
    '# Source References\n\nReferences to sources of knowledge.\n'
  );
  fs.writeFileSync(
    path.join(expertDir, 'concepts', 'comparisons.md'),
    '# Comparisons\n\nComparisons and contrasts between concepts.\n'
  );
  fs.writeFileSync(
    path.join(expertDir, 'gaps.md'),
    '# Knowledge Gaps\n\nIdentified gaps in knowledge that need to be filled.\n'
  );
  fs.writeFileSync(
    path.join(expertDir, 'conversation.md'),
    '# Conversation History\n\n'
  );

  return expert;
}

export async function updateExpert(id: string, data: Partial<Expert>): Promise<Expert | null> {
  const expert = await getExpert(id);
  if (!expert) return null;

  const updated = { ...expert, ...data };
  fs.writeFileSync(
    path.join(DATA_DIR, id, 'meta.json'),
    JSON.stringify(updated, null, 2)
  );

  return updated;
}

/**
 * Append an entry to the expert's log.md
 * Format: ## [YYYY-MM-DD] operation | title
 */
export async function appendLog(
  expertId: string,
  operation: 'ingest' | 'query' | 'lint' | 'export',
  title: string
): Promise<void> {
  const logPath = path.join(DATA_DIR, expertId, 'log.md');
  const date = new Date().toISOString().slice(0, 10);
  const entry = `\n## [${date}] ${operation} | ${title}\n`;
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, '# Log\n\nAppend-only record of wiki operations.\n');
  }
  fs.appendFileSync(logPath, entry);
}

export async function deleteExpert(id: string): Promise<boolean> {
  const expertDir = path.join(DATA_DIR, id);
  if (!fs.existsSync(expertDir)) return false;

  fs.rmSync(expertDir, { recursive: true });
  return true;
}

// Wiki/knowledge operations
export async function getWikiContent(expertId: string): Promise<{
  definitions: string;
  entities: string;
  sources: string;
  comparisons: string;
  gaps: string;
}> {
  const expertDir = path.join(DATA_DIR, expertId);

  const readFile = (filename: string, fallback = '') => {
    const p = path.join(expertDir, filename);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : fallback;
  };

  return {
    definitions: readFile('concepts/definitions.md'),
    entities: readFile('concepts/entities.md'),
    sources: readFile('concepts/sources.md'),
    comparisons: readFile('concepts/comparisons.md'),
    gaps: readFile('gaps.md'),
  };
}

export async function updateWikiContent(
  expertId: string,
  section: 'definitions' | 'entities' | 'sources' | 'comparisons' | 'gaps',
  content: string
): Promise<void> {
  const expertDir = path.join(DATA_DIR, expertId);
  const filePath =
    section === 'gaps'
      ? path.join(expertDir, 'gaps.md')
      : path.join(expertDir, 'concepts', `${section}.md`);

  fs.writeFileSync(filePath, content);
}

// Conversation operations
export async function getConversation(expertId: string): Promise<ChatMessage[]> {
  const convPath = path.join(DATA_DIR, expertId, 'conversation.md');
  if (!fs.existsSync(convPath)) return [];

  const content = fs.readFileSync(convPath, 'utf-8');
  const messages: ChatMessage[] = [];
  const sections = content.split(/^## /m);

  for (const section of sections) {
    if (!section.trim()) continue;
    const lines = section.split('\n');
    const headerMatch = lines[0]?.match(/^(User|Assistant) \((.+)\)/);
    if (headerMatch) {
      messages.push({
        role: headerMatch[1].toLowerCase() as 'user' | 'assistant',
        content: lines.slice(2).join('\n').trim(),
        timestamp: headerMatch[2],
      });
    }
  }

  return messages;
}

export async function addMessage(expertId: string, message: ChatMessage): Promise<void> {
  const convPath = path.join(DATA_DIR, expertId, 'conversation.md');
  const timestamp = new Date().toLocaleString();
  const entry = `\n## ${message.role === 'user' ? 'User' : 'Assistant'} (${timestamp})\n\n${message.content}\n`;

  fs.appendFileSync(convPath, entry);
}

// ========== CORE LLM-POWERED FUNCTIONS ==========

/**
 * Add a source to the expert's knowledge base
 * 1. Create timestamped folder in sources/
 * 2. Write source.md (original content)
 * 3. Call LLM to generate extract.md (summary, key points, entities)
 * 4. Trigger concept update
 */
export async function addSource(expertId: string, content: string): Promise<{
  sourceId: string;
  extract: { summary: string; keyPoints: string[]; entities: string[] };
}> {
  const expertDir = path.join(DATA_DIR, expertId, 'sources');

  // Create timestamped folder
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const sourceId = `${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
  const sourceFolder = path.join(expertDir, sourceId);
  fs.mkdirSync(sourceFolder, { recursive: true });

  // Write original source
  fs.writeFileSync(path.join(sourceFolder, 'source.md'), content);

  // Generate extract using LLM
  const extract = await generateExtract(content);

  // Write extract
  const extractMarkdown = `# Extract

## Summary
${extract.summary}

## Key Points
${extract.keyPoints.map((p) => `- ${p}`).join('\n')}

## Entities
${extract.entities.map((e) => `- ${e}`).join('\n')}
`;
  fs.writeFileSync(path.join(sourceFolder, 'extract.md'), extractMarkdown);

  // Update concepts with the new extract
  await updateConcepts(expertId);

  // Log the ingest
  const preview = content.slice(0, 60).replace(/\n/g, ' ');
  await appendLog(expertId, 'ingest', preview);

  return { sourceId, extract };
}

/**
 * Get all extracts from sources folder
 */
async function getAllExtracts(expertId: string): Promise<string[]> {
  const sourcesDir = path.join(DATA_DIR, expertId, 'sources');
  if (!fs.existsSync(sourcesDir)) return [];

  const extracts: string[] = [];
  const sourceFolders = fs.readdirSync(sourcesDir, { withFileTypes: true });

  for (const folder of sourceFolders) {
    if (folder.isDirectory()) {
      const extractPath = path.join(sourcesDir, folder.name, 'extract.md');
      if (fs.existsSync(extractPath)) {
        extracts.push(fs.readFileSync(extractPath, 'utf-8'));
      }
    }
  }

  return extracts;
}

/**
 * Update all concept files incrementally by merging new extracts
 */
export async function updateConcepts(expertId: string): Promise<void> {
  const wiki = await getWikiContent(expertId);
  const allExtracts = await getAllExtracts(expertId);

  if (allExtracts.length === 0) return;

  const expert = await getExpert(expertId);
  if (!expert) throw new Error('Expert not found');

  // Update each concept file incrementally
  const conceptFiles: Array<{
    key: 'definitions' | 'entities' | 'sources' | 'comparisons';
    prompt: string;
  }> = [
    {
      key: 'definitions',
      prompt: `Update the definitions file. Include:
- Core definitions from the extracts
- Updated terminology and explanations
- Main concepts and their meanings`,
    },
    {
      key: 'entities',
      prompt: `Extract and organize named entities from the extracts:
- People mentioned
- Organizations
- Topics and subjects
- Technologies, tools, or methods`,
    },
    {
      key: 'sources',
      prompt: `Create source references from the extracts:
- Key information sources
- Important facts from each source
- Source relationships and dependencies`,
    },
    {
      key: 'comparisons',
      prompt: `Identify and document comparisons and contrasts:
- Differences between concepts
- Similarities and overlaps
- Trade-offs and alternatives`,
    },
  ];

  for (const concept of conceptFiles) {
    const existingContent = wiki[concept.key];
    const updatedContent = await updateConceptsWithLLM(
      existingContent,
      allExtracts,
      concept.key
    );
    await updateWikiContent(expertId, concept.key, updatedContent);
  }
}

/**
 * Generate a response using LLM with wiki context
 */
export async function generateResponse(
  expertId: string,
  userMessage: string
): Promise<{ response: string; gaps: string[] }> {
  const expert = await getExpert(expertId);
  if (!expert) throw new Error('Expert not found');

  const wiki = await getWikiContent(expertId);

  // Generate response with LLM
  const result = await generateWikiResponse(userMessage, {
    definitions: wiki.definitions,
    entities: wiki.entities,
    sources: wiki.sources,
    comparisons: wiki.comparisons,
    gaps: wiki.gaps,
    expertName: expert.name,
    expertBio: expert.bio,
  });

  // Add conversation to history
  await addMessage(expertId, {
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString(),
  });
  await addMessage(expertId, {
    role: 'assistant',
    content: result.response,
    timestamp: new Date().toISOString(),
  });

  // If gaps detected, update gaps.md
  if (result.detectedGaps.length > 0) {
    await addDetectedGaps(expertId, result.detectedGaps);
  }

  // Log the query
  await appendLog(expertId, 'query', userMessage.slice(0, 80));

  return { response: result.response, gaps: result.detectedGaps };
}

/**
 * Add detected gaps to gaps.md
 */
async function addDetectedGaps(expertId: string, gaps: string[]): Promise<void> {
  const gapsPath = path.join(DATA_DIR, expertId, 'gaps.md');
  const existingGaps = fs.existsSync(gapsPath)
    ? fs.readFileSync(gapsPath, 'utf-8')
    : '# Knowledge Gaps\n\n';

  // Get existing gap topics
  const existingTopics = new Set(
    existingGaps
      .split('\n')
      .filter((l) => l.startsWith('## '))
      .map((l) => l.replace('## ', '').trim())
  );

  // Add new gaps
  let newGapsContent = existingGaps;
  for (const gap of gaps) {
    if (!existingTopics.has(gap)) {
      newGapsContent += `\n## ${gap}\n\n- Detected: ${new Date().toLocaleString()}\n- Status: Unfilled\n\n`;
    }
  }

  fs.writeFileSync(gapsPath, newGapsContent);
}

/**
 * Auto-fill a knowledge gap by generating content
 */
export async function autoFillGap(expertId: string, gapTopic: string): Promise<void> {
  const expert = await getExpert(expertId);
  if (!expert) throw new Error('Expert not found');

  const wiki = await getWikiContent(expertId);

  // Generate content for the gap using LLM
  const generatedContent = await generateGapContent(gapTopic, {
    name: expert.name,
    bio: expert.bio,
    definitions: wiki.definitions,
    entities: wiki.entities,
  });

  // Add as a new source
  await addSource(expertId, generatedContent);

  // Update the gaps file to mark this gap as filled
  const gapsPath = path.join(DATA_DIR, expertId, 'gaps.md');
  if (fs.existsSync(gapsPath)) {
    let gapsContent = fs.readFileSync(gapsPath, 'utf-8');
    gapsContent = gapsContent.replace(
      new RegExp(`## ${gapTopic}[\\s\\S]*?- Status: Unfilled`, 'i'),
      `## ${gapTopic}\n\n- Status: Filled\n- Filled: ${new Date().toISOString()}\n`
    );
    fs.writeFileSync(gapsPath, gapsContent);
  }
}

/**
 * Get all sources for an expert
 */
export async function getSources(expertId: string): Promise<
  Array<{
    id: string;
    folder: string;
    source: string;
    extract: string;
  }>
> {
  const sourcesDir = path.join(DATA_DIR, expertId, 'sources');
  if (!fs.existsSync(sourcesDir)) return [];

  const sources: Array<{
    id: string;
    folder: string;
    source: string;
    extract: string;
  }> = [];

  const folders = fs.readdirSync(sourcesDir, { withFileTypes: true });

  for (const folder of folders) {
    if (folder.isDirectory()) {
      const sourcePath = path.join(sourcesDir, folder.name, 'source.md');
      const extractPath = path.join(sourcesDir, folder.name, 'extract.md');

      sources.push({
        id: folder.name,
        folder: folder.name,
        source: fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, 'utf-8') : '',
        extract: fs.existsSync(extractPath) ? fs.readFileSync(extractPath, 'utf-8') : '',
      });
    }
  }

  return sources;
}
