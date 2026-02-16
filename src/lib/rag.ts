// @ts-nocheck
import { getHomeCmsData } from '@/lib/cms'

function normalize(text: string) {
  return (text || '').toLocaleLowerCase('tr-TR')
}

function scoreText(haystack: string, needles: string[]) {
  const base = normalize(haystack)
  let score = 0

  for (const needle of needles) {
    if (!needle) continue
    if (base.includes(needle)) score += 1
  }

  return score
}

export async function buildRagContext(userQuestion: string) {
  const data = await getHomeCmsData()
  const tokens = normalize(userQuestion)
    .split(/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 2)

  const blogHits = (data.blogs || [])
    .map((blog: any) => ({
      ...blog,
      _score: scoreText(`${blog.title} ${blog.excerpt}`, tokens),
    }))
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, 3)

  const projectHits = (data.projects || [])
    .map((project: any) => ({
      ...project,
      _score: scoreText(`${project.title} ${project.excerpt}`, tokens),
    }))
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, 3)

  const skillHits = (data.skills || [])
    .map((skill: any) => ({
      ...skill,
      _score: scoreText(`${skill.name} ${skill.category}`, tokens),
    }))
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, 6)

  return {
    blogHits,
    projectHits,
    skillHits,
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

