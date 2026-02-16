// @ts-nocheck
'use client'

import { useMemo, useState } from 'react'

function groupColor(group: string) {
  switch (group) {
    case 'AI':
      return '#7ad7ff'
    case 'Data':
      return '#95a7ff'
    case 'Web':
      return '#9df0d1'
    case 'Growth':
      return '#ffc48f'
    default:
      return '#d8e2ff'
  }
}

export default function KnowledgeGraph({ graph }) {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  const layout = useMemo(() => {
    const width = 900
    const height = 420
    const cx = width / 2
    const cy = height / 2
    const radius = Math.min(width, height) * 0.34
    const nodes = graph?.nodes || []
    const edges = graph?.edges || []

    const index = new Map<string, number>()
    nodes.forEach((n: any, i: number) => index.set(n.id, i))

    const points = nodes.map((node: any, i: number) => {
      const t = (i / Math.max(1, nodes.length)) * Math.PI * 2
      const localR = radius + ((node.weight || 1) % 4) * 7
      return {
        ...node,
        x: cx + Math.cos(t) * localR,
        y: cy + Math.sin(t) * localR,
      }
    })

    const lines = edges
      .map((edge: any) => {
        const si = index.get(edge.source)
        const ti = index.get(edge.target)
        if (si === undefined || ti === undefined) return null
        return {
          ...edge,
          sourceNode: points[si],
          targetNode: points[ti],
        }
      })
      .filter(Boolean)

    return { width, height, points, lines }
  }, [graph])

  return (
    <div className="garden-graph" aria-label="Digital Garden knowledge graph">
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label="Blog ve notlar arası ilişki ağı">
        <defs>
          <radialGradient id="graphGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(128, 191, 255, 0.22)" />
            <stop offset="100%" stopColor="rgba(128, 191, 255, 0)" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={layout.width} height={layout.height} fill="url(#graphGlow)" />

        {layout.lines.map((line: any, idx: number) => {
          const active = activeNode && (line.source === activeNode || line.target === activeNode)
          return (
            <line
              key={`${line.source}-${line.target}-${idx}`}
              x1={line.sourceNode.x}
              y1={line.sourceNode.y}
              x2={line.targetNode.x}
              y2={line.targetNode.y}
              stroke={active ? 'rgba(145, 212, 255, 0.95)' : 'rgba(180, 196, 255, 0.32)'}
              strokeWidth={Math.max(1, Number(line.strength || 0.3) * 2)}
            />
          )
        })}

        {layout.points.map((node: any) => {
          const active = activeNode === node.id
          const fill = groupColor(node.group)
          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r={active ? 14 : 10}
                fill={fill}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.2"
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                onClick={() => (window.location.href = node.slug ? `/blog/${node.slug}` : '#')}
                style={{ cursor: 'pointer' }}
              />
              <text x="14" y="4" fill="#dce8ff" fontSize="11" pointerEvents="none">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

