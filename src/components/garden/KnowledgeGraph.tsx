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

function maturityColor(maturity: string) {
  const m = String(maturity || '').toLowerCase()
  if (m === 'evergreen') return '#89f0c7'
  if (m === 'growing') return '#9fc2ff'
  return '#ffd694'
}

export default function KnowledgeGraph({ graph }) {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [topicFilter, setTopicFilter] = useState('all')
  const [maturityFilter, setMaturityFilter] = useState('all')
  const [recencyFilter, setRecencyFilter] = useState('all')

  const availableTopics = useMemo(() => {
    const groups = new Set((graph?.nodes || []).map((n: any) => String(n.group || 'General')))
    return ['all', ...Array.from(groups)]
  }, [graph])

  const layout = useMemo(() => {
    const width = 900
    const height = 420
    const cx = width / 2
    const cy = height / 2
    const radius = Math.min(width, height) * 0.34
    const rawNodes = graph?.nodes || []
    const rawEdges = graph?.edges || []

    const nodes = rawNodes.filter((node: any) => {
      const topicOk = topicFilter === 'all' || String(node.group || '') === topicFilter
      const maturityOk = maturityFilter === 'all' || String(node.maturity || '') === maturityFilter
      const recencyOk = recencyFilter === 'all' || String(node.recency || 'archive') === recencyFilter
      return topicOk && maturityOk && recencyOk
    })

    const nodeIdSet = new Set(nodes.map((n: any) => n.id))
    const edges = rawEdges.filter(
      (edge: any) => nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target),
    )

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
  }, [graph, topicFilter, maturityFilter, recencyFilter])

  return (
    <div className="garden-graph" aria-label="Digital Garden knowledge graph">
      <div className="garden-filters" aria-label="Bilgi grafiği filtreleri">
        <label>
          Topic
          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic === 'all' ? 'All Topics' : topic}
              </option>
            ))}
          </select>
        </label>

        <label>
          Maturity
          <select value={maturityFilter} onChange={(e) => setMaturityFilter(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="seed">Seed</option>
            <option value="growing">Growing</option>
            <option value="evergreen">Evergreen</option>
          </select>
        </label>

        <label>
          Recency
          <select value={recencyFilter} onChange={(e) => setRecencyFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="recent">Recent</option>
            <option value="mid">Mid</option>
            <option value="archive">Archive</option>
          </select>
        </label>
      </div>

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
          const ring = maturityColor(node.maturity)
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
              <circle r={active ? 17 : 13} fill="none" stroke={ring} strokeWidth="1.2" opacity="0.65" />
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

