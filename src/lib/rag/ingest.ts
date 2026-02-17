// @ts-nocheck
import { getHomeCmsData } from '@/lib/cms'

function normalize(value: string) {
  return String(value || '').toLocaleLowerCase('tr-TR').trim()
}

function tokenize(text: string) {
  return normalize(text)
    .split(/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 2)
}

export async function buildRagCorpus() {
  const data = await getHomeCmsData()

  const documents: any[] = []

  for (const blog of data.blogs || []) {
    documents.push({
      id: `blog:${blog.slug || blog.title}`,
      kind: 'blog',
      title: blog.title,
      excerpt: blog.excerpt,
      slug: blog.slug,
      searchable: `${blog.title || ''} ${blog.excerpt || ''}`,
      tokens: tokenize(`${blog.title || ''} ${blog.excerpt || ''}`),
      meta: { maturity: blog.maturity || 'seed' },
    })
  }

  for (const project of data.projects || []) {
    documents.push({
      id: `project:${project.slug || project.title}`,
      kind: 'project',
      title: project.title,
      excerpt: project.excerpt,
      slug: project.slug,
      searchable: `${project.title || ''} ${project.excerpt || ''}`,
      tokens: tokenize(`${project.title || ''} ${project.excerpt || ''}`),
      meta: { maturity: project.maturity || 'growing' },
    })
  }

  for (const skill of data.skills || []) {
    documents.push({
      id: `skill:${skill.name}`,
      kind: 'skill',
      title: skill.name,
      excerpt: `${skill.category || ''}`,
      slug: null,
      searchable: `${skill.name || ''} ${skill.category || ''}`,
      tokens: tokenize(`${skill.name || ''} ${skill.category || ''}`),
      meta: {
        category: skill.category,
        trendScore: skill.trendScore,
        proficiencyLevel: skill.proficiencyLevel,
      },
    })
  }

  return documents
}

