// @ts-nocheck
import { sanityFetch } from '@/lib/sanity'

const blogQuery = `*[_type == "blogPost"] | order(_updatedAt desc)[0...3]{
  "title": coalesce(base->title, "Untitled Blog"),
  "excerpt": coalesce(base->excerpt, "İçerik özeti yakında eklenecek."),
  "slug": base->slug.current,
  "maturity": coalesce(base->contentMaturity, "seed")
}`

const projectQuery = `*[_type == "caseStudy"] | order(_updatedAt desc)[0...3]{
  "title": coalesce(base->title, "Untitled Project"),
  "excerpt": coalesce(outcomeSummary, base->excerpt, "Vaka analizi özeti yakında eklenecek."),
  "slug": base->slug.current,
  "maturity": coalesce(base->contentMaturity, "growing")
}`

const skillQuery = `*[_type == "skill"] | order(trendScore desc)[0...6]{
  name,
  category,
  trendScore,
  proficiencyLevel
}`

const fallback = {
  blogs: [
    {
      title: 'Digital Garden Başlangıç Notları',
      excerpt: 'Seed aşamasındaki fikirlerin ürünleşme sürecine dönüşümü.',
      slug: '#',
      maturity: 'seed',
    },
  ],
  projects: [
    {
      title: 'E-ticaret Dönüşüm Dashboardu',
      excerpt: 'Case study metrikleri ile veri hikayeciliği tabanlı analiz.',
      slug: '#',
      maturity: 'growing',
    },
  ],
  skills: [
    { name: 'Next.js', category: 'Web', trendScore: 90, proficiencyLevel: 5 },
    { name: 'Python', category: 'Data', trendScore: 95, proficiencyLevel: 5 },
    { name: 'PostgreSQL', category: 'Data', trendScore: 88, proficiencyLevel: 4 },
  ],
}

export async function getHomeCmsData() {
  const [blogs, projects, skills] = await Promise.all([
    sanityFetch(blogQuery),
    sanityFetch(projectQuery),
    sanityFetch(skillQuery),
  ])

  return {
    blogs: blogs?.length ? blogs : fallback.blogs,
    projects: projects?.length ? projects : fallback.projects,
    skills: skills?.length ? skills : fallback.skills,
  }
}

const caseStudyBySlugQuery = `*[_type == "caseStudy" && base->slug.current == $slug][0]{
  "title": coalesce(base->title, "Untitled Project"),
  "excerpt": coalesce(base->excerpt, ""),
  "body": base->body,
  "publishedAt": base->publishedAt,
  clientName,
  industry,
  problemStatement,
  methodology,
  outcomeSummary,
  impactScore,
  repoUrl,
  demoUrl,
  "metrics": coalesce(metrics, []),
  "architectureDiagramMermaid": architectureDiagramMermaid
}`

const fallbackCaseStudy = {
  title: 'E-ticaret Dönüşüm Dashboardu',
  excerpt: 'Veri hikayeciliği odaklı, karar verdiren analitik vaka analizi.',
  body: [],
  publishedAt: null,
  clientName: 'Örnek Marka',
  industry: 'E-commerce',
  problemStatement:
    'Kampanya performansının kanal bazında görünürlüğü düşüktü, karar alma süreci yavaştı.',
  methodology:
    'Event tabanlı veri modeli kuruldu, KPI katmanı normalize edildi, yönetim paneli tasarlandı.',
  outcomeSummary:
    'Gelir başına maliyet görünürlüğü arttı, kampanya optimizasyonu için haftalık karar döngüsü hızlandı.',
  impactScore: 87,
  repoUrl: '#',
  demoUrl: '#',
  metrics: [
    {
      metricKey: 'conversion_rate',
      metricLabel: 'Conversion Rate',
      baselineValue: 1.9,
      resultValue: 3.1,
      unit: '%',
      periodLabel: '8 hafta',
    },
    {
      metricKey: 'cac',
      metricLabel: 'Customer Acquisition Cost',
      baselineValue: 18.4,
      resultValue: 12.7,
      unit: '$',
      periodLabel: '8 hafta',
    },
  ],
  architectureDiagramMermaid: `flowchart LR
  A[Data Sources] --> B[ETL Pipeline]
  B --> C[PostgreSQL]
  C --> D[Analytics Service]
  D --> E[Case Study Dashboard]
  E --> F[Decision Loop]`,
}

export async function getCaseStudyBySlug(slug: string) {
  const data = await sanityFetch(caseStudyBySlugQuery, { slug })
  return data || fallbackCaseStudy
}

const knowledgeGraphQuery = `*[_type == "contentBase" && kind == "blog_post"]{
  _id,
  title,
  "slug": slug.current,
  "maturity": coalesce(contentMaturity, "seed"),
  "tags": tags[]->label,
  "related": relatedContents[]{
    relationType,
    strength,
    "targetId": target->_id,
    "targetSlug": target->slug.current,
    "targetTitle": target->title
  }
}`

const fallbackKnowledgeGraph = {
  nodes: [
    { id: 'n1', label: 'Yapay Zeka Notları', slug: 'yapay-zeka-notlari', group: 'AI', weight: 1, maturity: 'seed' },
    { id: 'n2', label: 'NLP Pratikleri', slug: 'nlp-pratikleri', group: 'AI', weight: 1, maturity: 'growing' },
    { id: 'n3', label: 'Veri Hikayeciliği', slug: 'veri-hikayeciligi', group: 'Data', weight: 1, maturity: 'evergreen' },
    { id: 'n4', label: 'E-ticaret Analitik', slug: 'e-ticaret-analitik', group: 'Growth', weight: 1, maturity: 'growing' },
    { id: 'n5', label: 'Next.js Mimari', slug: 'nextjs-mimari', group: 'Web', weight: 1, maturity: 'evergreen' },
  ],
  edges: [
    { source: 'n1', target: 'n2', relationType: 'expands', strength: 0.8 },
    { source: 'n3', target: 'n4', relationType: 'applies_to', strength: 0.7 },
    { source: 'n5', target: 'n3', relationType: 'supports', strength: 0.6 },
    { source: 'n2', target: 'n3', relationType: 'prerequisite', strength: 0.5 },
  ],
}

function pickGroup(tags: string[] = []) {
  const set = (tags || []).map((x) => String(x || '').toLowerCase())
  if (set.some((x) => x.includes('ai') || x.includes('yapay zeka') || x.includes('nlp'))) return 'AI'
  if (set.some((x) => x.includes('veri') || x.includes('data'))) return 'Data'
  if (set.some((x) => x.includes('web') || x.includes('next'))) return 'Web'
  if (set.some((x) => x.includes('pazarlama') || x.includes('growth') || x.includes('e-ticaret'))) return 'Growth'
  return 'General'
}

function normalizeMaturity(value: string) {
  const v = String(value || '').toLowerCase().trim()
  if (v === 'growing') return 'growing'
  if (v === 'evergreen') return 'evergreen'
  return 'seed'
}

export async function getKnowledgeGraphData() {
  const raw = await sanityFetch(knowledgeGraphQuery)
  if (!raw?.length) return fallbackKnowledgeGraph

  const nodes = raw.map((item: any) => ({
    id: item._id,
    label: item.title || 'Untitled',
    slug: item.slug || '',
    group: pickGroup(item.tags || []),
    weight: Math.max(1, (item.related || []).length),
    maturity: normalizeMaturity(item.maturity),
  }))

  const nodeSet = new Set(nodes.map((n: any) => n.id))
  const edges: any[] = []

  for (const item of raw) {
    for (const rel of item.related || []) {
      if (!rel?.targetId || !nodeSet.has(rel.targetId)) continue
      edges.push({
        source: item._id,
        target: rel.targetId,
        relationType: rel.relationType || 'related',
        strength: Number(rel.strength || 0.5),
      })
    }
  }

  return {
    nodes: nodes.length ? nodes : fallbackKnowledgeGraph.nodes,
    edges: edges.length ? edges : fallbackKnowledgeGraph.edges,
  }
}

