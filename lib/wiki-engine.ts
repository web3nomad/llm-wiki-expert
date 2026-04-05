import fs from 'fs';
import path from 'path';

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

// Ensure expert directory exists
function ensureExpertDir(expertId: string) {
  const expertDir = path.join(DATA_DIR, expertId);
  const subdirs = ['sources', 'concepts'];
  
  if (!fs.existsSync(expertDir)) {
    fs.mkdirSync(expertDir, { recursive: true });
    subdirs.forEach(subdir => {
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
  
  // Initialize wiki files
  fs.writeFileSync(path.join(expertDir, 'concepts', 'definitions.md'), '# Definitions\n\n');
  fs.writeFileSync(path.join(expertDir, 'concepts', 'taxonomy.md'), '# Taxonomy\n\n');
  fs.writeFileSync(path.join(expertDir, 'concepts', 'connections.md'), '# Connections\n\n');
  fs.writeFileSync(path.join(expertDir, 'gaps.md'), '# Knowledge Gaps\n\n');
  fs.writeFileSync(path.join(expertDir, 'conversation.md'), '# Conversation History\n\n');
  
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

export async function deleteExpert(id: string): Promise<boolean> {
  const expertDir = path.join(DATA_DIR, id);
  if (!fs.existsSync(expertDir)) return false;
  
  fs.rmSync(expertDir, { recursive: true });
  return true;
}

// Wiki/knowledge operations
export async function getWikiContent(expertId: string): Promise<{
  definitions: string;
  taxonomy: string;
  connections: string;
  gaps: string;
}> {
  const expertDir = path.join(DATA_DIR, expertId);
  
  return {
    definitions: fs.readFileSync(path.join(expertDir, 'concepts', 'definitions.md'), 'utf-8'),
    taxonomy: fs.readFileSync(path.join(expertDir, 'concepts', 'taxonomy.md'), 'utf-8'),
    connections: fs.readFileSync(path.join(expertDir, 'concepts', 'connections.md'), 'utf-8'),
    gaps: fs.readFileSync(path.join(expertDir, 'gaps.md'), 'utf-8'),
  };
}

export async function updateWikiContent(
  expertId: string,
  section: 'definitions' | 'taxonomy' | 'connections' | 'gaps',
  content: string
): Promise<void> {
  const expertDir = path.join(DATA_DIR, expertId);
  const filePath = section === 'gaps' 
    ? path.join(expertDir, 'gaps.md')
    : path.join(expertDir, 'concepts', `${section}.md`);
  
  fs.writeFileSync(filePath, content);
}

// Conversation operations
export async function getConversation(expertId: string): Promise<ChatMessage[]> {
  const convPath = path.join(DATA_DIR, expertId, 'conversation.md');
  // For simplicity, return empty array - real impl would parse markdown
  return [];
}

export async function addMessage(
  expertId: string,
  message: ChatMessage
): Promise<void> {
  const convPath = path.join(DATA_DIR, expertId, 'conversation.md');
  const timestamp = new Date().toLocaleString();
  const entry = `\n## ${message.role === 'user' ? 'User' : 'Assistant'} (${timestamp})\n\n${message.content}\n`;
  
  fs.appendFileSync(convPath, entry);
}

// Sources operations
export async function addSource(expertId: string, content: string): Promise<void> {
  const sourceDir = path.join(DATA_DIR, expertId, 'sources');
  const filename = `source-${Date.now()}.md`;
  fs.writeFileSync(path.join(sourceDir, filename), content);
}

export async function getSources(expertId: string): Promise<string[]> {
  const sourceDir = path.join(DATA_DIR, expertId, 'sources');
  if (!fs.existsSync(sourceDir)) return [];
  
  return fs.readdirSync(sourceDir).map(name => 
    fs.readFileSync(path.join(sourceDir, name), 'utf-8')
  );
}

// Gap detection - simplified LLM simulation
export async function detectGaps(
  expertId: string,
  userMessage: string,
  currentWiki: string
): Promise<KnowledgeGap[]> {
  const gaps: KnowledgeGap[] = [];
  
  // Simple keyword-based gap detection (in production, use actual LLM)
  const gapIndicators = [
    { keywords: ['how', 'what', 'explain'], topic: 'explanation needed', description: 'User asked for explanation' },
    { keywords: ['difference', 'compare'], topic: 'comparison needed', description: 'User wants comparison' },
    { keywords: ['example', 'instance'], topic: 'examples needed', description: 'User wants examples' },
  ];
  
  for (const indicator of gapIndicators) {
    if (indicator.keywords.some(k => userMessage.toLowerCase().includes(k))) {
      gaps.push({
        topic: indicator.topic,
        description: indicator.description,
        detectedAt: new Date().toISOString(),
      });
    }
  }
  
  return gaps;
}

// Generate AI response (simplified - in production would use actual LLM)
export async function generateResponse(
  expertId: string,
  userMessage: string
): Promise<{ response: string; gaps: KnowledgeGap[] }> {
  const expert = await getExpert(expertId);
  const wiki = await getWikiContent(expertId);
  
  // Detect gaps
  const gaps = await detectGaps(expertId, userMessage, JSON.stringify(wiki));
  
  // Generate response (simplified)
  const response = generateSimplifiedResponse(expert!, userMessage, wiki);
  
  // Add to conversation
  await addMessage(expertId, { role: 'user', content: userMessage, timestamp: new Date().toISOString() });
  await addMessage(expertId, { role: 'assistant', content: response, timestamp: new Date().toISOString() });
  
  return { response, gaps };
}

function generateSimplifiedResponse(expert: Expert, message: string, wiki: { definitions: string; taxonomy: string; connections: string; gaps: string }): string {
  const lowerMessage = message.toLowerCase();
  
  // Simple rule-based responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! I'm ${expert.name}. ${expert.bio} How can I help you today?`;
  }
  
  if (lowerMessage.includes('what do you know') || lowerMessage.includes('your expertise')) {
    return `My expertise includes:\n\n${wiki.taxonomy}\n\nI have knowledge about:\n${wiki.definitions}\n\nFeel free to ask me anything!`;
  }
  
  if (lowerMessage.includes('help')) {
    return `I can help you with:\n- Answering questions about my expertise\n- Discussing concepts in my knowledge base\n- Identifying gaps in my knowledge\n\nWhat would you like to explore?`;
  }
  
  // Default response
  return `That's an interesting question! Based on my knowledge base, I can share some insights. However, I notice there might be areas I could learn more about.\n\nWould you like me to elaborate or explore a specific aspect?`;
}

// Auto-fill gaps (simplified)
export async function autoFillGap(expertId: string, gap: KnowledgeGap): Promise<void> {
  const wiki = await getWikiContent(expertId);
  
  // In production, this would use actual LLM to generate content
  const newContent = `\n\n## ${gap.topic}\n\n${gap.description} - This is auto-generated content to fill the knowledge gap.`;
  
  await updateWikiContent(expertId, 'definitions', wiki.definitions + newContent);
}
