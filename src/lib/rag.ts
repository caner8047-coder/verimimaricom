// @ts-nocheck
import { buildRagCorpus } from '@/lib/rag/ingest'
import { retrieveCandidates } from '@/lib/rag/retrieve'
import { rankRagContext } from '@/lib/rag/rank'

export async function buildRagContext(userQuestion: string) {
  const corpus = await buildRagCorpus()
  const candidates = retrieveCandidates(corpus, userQuestion)
  return rankRagContext(candidates)
}

export function toContextText(context: any) {
  const blogText = (context.blogHits || [])
    .map((b: any) => `- Blog: ${b.title} | ${b.excerpt} | slug: ${b.slug || '-'}`)
    .join('\n')

  const projectText = (context.projectHits || [])
    .map((p: any) => `- Project: ${p.title} | ${p.excerpt} | slug: ${p.slug || '-'}`)
    .join('\n')

  const skillText = (context.skillHits || [])
    .map((s: any) => `- Skill: ${s.name} | category: ${s.category} | trend: ${s.trendScore || '-'} | level: ${s.proficiencyLevel || '-'}`)
    .join('\n')

  return `
[BLOG HITS]
${blogText || '-'}

[PROJECT HITS]
${projectText || '-'}

[SKILL HITS]
${skillText || '-'}
  `.trim()
}

