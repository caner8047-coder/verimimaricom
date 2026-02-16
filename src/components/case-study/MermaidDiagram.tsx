// @ts-nocheck
'use client'

import { useEffect, useMemo, useState } from 'react'

export default function MermaidDiagram({ chart = '' }) {
  const [svg, setSvg] = useState('')
  const [failed, setFailed] = useState(false)

  const source = useMemo(() => {
    const trimmed = (chart || '').trim()
    if (!trimmed) {
      return `flowchart LR
  A[No Diagram Source] --> B[Add architectureDiagramMermaid in Sanity]`
    }
    return trimmed
  }, [chart])

  useEffect(() => {
    let mounted = true

    async function renderMermaid() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'dark' })
        const id = `case-diagram-${Math.random().toString(36).slice(2)}`
        const result = await mermaid.render(id, source)
        if (mounted) {
          setSvg(result.svg)
          setFailed(false)
        }
      } catch (_err) {
        if (mounted) {
          setFailed(true)
          setSvg('')
        }
      }
    }

    renderMermaid()
    return () => {
      mounted = false
    }
  }, [source])

  return (
    <div className="mermaid-shell" aria-label="System architecture diagram">
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="mermaid-fallback">
          Mermaid render bekleniyor. Eğer paket kurulu değilse kaynak şema aşağıda görüntülenir.
        </div>
      )}

      {(failed || !svg) && <pre className="mermaid-source">{source}</pre>}
    </div>
  )
}

