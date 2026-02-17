// @ts-nocheck

function topByKind(items: any[], kind: string, limit: number) {
  return (items || [])
    .filter((x: any) => x.kind === kind)
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, limit)
}

export function rankRagContext(candidates: any[]) {
  const blogHits = topByKind(candidates, 'blog', 3)
  const projectHits = topByKind(candidates, 'project', 3)
  const skillHits = topByKind(candidates, 'skill', 6)

  return {
    blogHits,
    projectHits,
    skillHits,
    diagnostics: {
      totalCandidates: (candidates || []).length,
      maxScore: Math.max(0, ...(candidates || []).map((x: any) => Number(x._score || 0))),
    },
  }
}

