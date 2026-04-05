'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Node { id: string; label: string; type: string; size: number; x?: number; y?: number; }
interface Edge { source: string; target: string; label: string; }

export default function GraphPage() {
  const params = useParams();
  const expertId = params.id as string;
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [expertName, setExpertName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Node | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch(`/api/graph?expertId=${expertId}`)
      .then(r => r.json())
      .then(data => {
        // Simple circular layout
        const n = data.nodes.length;
        const cx = 400, cy = 300, r = 220;
        const positioned = data.nodes.map((node: Node, i: number) => ({
          ...node,
          x: cx + r * Math.cos((2 * Math.PI * i) / n),
          y: cy + r * Math.sin((2 * Math.PI * i) / n),
        }));
        setNodes(positioned);
        setEdges(data.edges);
        setExpertName(data.expert);
        setLoading(false);
      });
  }, [expertId]);

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const colors = { concept: '#818cf8', entity: '#34d399', principle: '#fbbf24' };
  // scale node size by connection count
  const connectionCount: Record<string, number> = {};
  edges.forEach(e => {
    connectionCount[e.source] = (connectionCount[e.source] || 0) + 1;
    connectionCount[e.target] = (connectionCount[e.target] || 0) + 1;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/expert/${expertId}/knowledge`} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">← Knowledge</Link>
          <h1 className="text-xl font-bold">🕸️ {expertName} — Knowledge Graph</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--muted-foreground)]">Building graph...</div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <svg ref={svgRef} width="800" height="600" className="w-full bg-[#0f1117]" viewBox="0 0 800 600">
              {/* Glow filter */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* Edges */}
              {edges.map((e, i) => {
                const s = nodeMap[e.source], t = nodeMap[e.target];
                if (!s || !t) return null;
                return (
                  <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke="#334155" strokeWidth="1.5" opacity="0.7" />
                );
              })}
              {/* Nodes */}
              {nodes.map(node => {
                const conns = connectionCount[node.id] || 0;
                const r = Math.max(node.size, 6) + conns * 2;
                const color = colors[node.type as keyof typeof colors] || '#94a3b8';
                return (
                <g key={node.id} onClick={() => setSelected(node)} style={{ cursor: 'pointer' }}>
                  {/* outer glow ring */}
                  <circle cx={node.x} cy={node.y} r={r + 4}
                    fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
                  <circle cx={node.x} cy={node.y} r={r}
                    fill={color} opacity={selected?.id === node.id ? 1 : 0.85}
                    filter="url(#glow)"
                    stroke={selected?.id === node.id ? '#fff' : color}
                    strokeWidth={selected?.id === node.id ? 2 : 0}
                  />
                  <text x={node.x} y={(node.y ?? 0) + r + 13}
                    textAnchor="middle" fontSize="10" fill="#94a3b8" opacity="0.9">
                    {node.label.length > 16 ? node.label.slice(0, 14) + '…' : node.label}
                  </text>
                </g>
                );
              })}
            </svg>
            <div className="p-4 border-t border-[var(--border)] flex items-center gap-6 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"/> Concept</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/> Entity</span>
              {selected && <span className="ml-auto font-medium text-[var(--foreground)]">Selected: {selected.label}</span>}
              <span>{nodes.length} nodes · {edges.length} connections</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
