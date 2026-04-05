import { NextRequest, NextResponse } from 'next/server';
import { getWikiContent, getExpert } from '@/lib/wiki-engine';

interface GraphNode {
  id: string;
  label: string;
  type: 'concept' | 'entity' | 'principle';
  size: number;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

function parseNodes(markdown: string, type: GraphNode['type']): GraphNode[] {
  const nodes: GraphNode[] = [];
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const label = match[1].trim();
    if (label.length < 2 || label.length > 60) continue;
    nodes.push({
      id: label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      label,
      type,
      size: type === 'concept' ? 12 : 8,
    });
  }
  return nodes;
}

function inferEdges(nodes: GraphNode[], markdown: string): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  for (const node of nodes) {
    for (const other of nodes) {
      if (node.id === other.id) continue;
      const key = [node.id, other.id].sort().join('--');
      if (seen.has(key)) continue;
      // Check if node's label appears in sections around other node
      const regex = new RegExp(`#{2,3}\\s+${other.label}[\\s\\S]{0,500}${node.label}`, 'i');
      if (regex.test(markdown)) {
        seen.add(key);
        edges.push({ source: node.id, target: other.id, label: 'related' });
      }
    }
  }
  return edges;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const expertId = searchParams.get('expertId');

  if (!expertId) {
    return NextResponse.json({ error: 'expertId required' }, { status: 400 });
  }

  const expert = await getExpert(expertId);
  if (!expert) {
    return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
  }

  const wiki = await getWikiContent(expertId);
  const combined = wiki.definitions + '\n' + wiki.sources;

  const conceptNodes = parseNodes(wiki.definitions, 'concept').slice(0, 20);
  const entityNodes = parseNodes(wiki.sources, 'entity').slice(0, 10);
  const nodes = [...conceptNodes, ...entityNodes];
  const edges = inferEdges(nodes, combined).slice(0, 40);

  return NextResponse.json({ nodes, edges, expert: expert.name });
}
