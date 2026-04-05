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
  const colors = { concept: '#6366f1', entity: '#10b981', principle: '#f59e0b' };

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
            <svg ref={svgRef} width="800" height="600" className="w-full" viewBox="0 0 800 600">
              {/* Edges */}
              {edges.map((e, i) => {
                const s = nodeMap[e.source], t = nodeMap[e.target];
                if (!s || !t) return null;
                return (
                  <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke="#e2e8f0" strokeWidth="1" opacity="0.6" />
                );
              })}
              {/* Nodes */}
              {nodes.map(node => (
                <g key={node.id} onClick={() => setSelected(node)} style={{ cursor: 'pointer' }}>
                  <circle cx={node.x} cy={node.y} r={node.size}
                    fill={colors[node.type as keyof typeof colors] || '#94a3b8'}
                    opacity={selected?.id === node.id ? 1 : 0.8}
                    stroke={selected?.id === node.id ? '#fff' : 'none'}
                    strokeWidth="2"
                  />
                  <text x={node.x} y={(node.y ?? 0) + node.size + 12}
                    textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">
                    {node.label.length > 18 ? node.label.slice(0, 16) + '…' : node.label}
                  </text>
                </g>
              ))}
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
