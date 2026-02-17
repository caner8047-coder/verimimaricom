// @ts-nocheck
import { buildRagCorpus } from '@/lib/rag/ingest'
import { retrieveCandidates } from '@/lib/rag/retrieve'
import { rankRagContext } from '@/lib/rag/rank'
import { retrieveFromVectorStore } from '@/lib/rag/vector'

export async function buildRagContext(userQuestion: string) {
  const vectorCandidates = await retrieveFromVectorStore(userQuestion)
  if (vectorCandidates?.length) {
    const ranked = rankRagContext(vectorCandidates)
    return {
      ...ranked,
      diagnostics: {
        ...(ranked.diagnostics || {}),
        retrievalMode: 'vector',
      },
    }
  }

  const corpus = await buildRagCorpus()
  const candidates = retrieveCandidates(corpus, userQuestion)
  const ranked = rankRagContext(candidates)
  return {
    ...ranked,
    diagnostics: {
      ...(ranked.diagnostics || {}),
      retrievalMode: 'local-fallback',
    },
  }
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

