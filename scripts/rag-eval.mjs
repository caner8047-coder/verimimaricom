import { buildRagContext } from '../src/lib/rag'

const EVAL_SET = [
  {
    prompt: 'NLP tarafında hangi projeler öne çıkıyor?',
    expectedAny: ['project', 'blog', 'skill'],
  },
  {
    prompt: 'E-ticaret dönüşüm için hangi vaka analizini incelemeliyim?',
    expectedAny: ['project'],
  },
  {
    prompt: 'Next.js teknoloji yığını hakkında hangi içerikler var?',
    expectedAny: ['skill', 'blog'],
  },
]

async function run() {
  const rows = []

  for (const item of EVAL_SET) {
    const context = await buildRagContext(item.prompt)
    const hasBlog = (context.blogHits || []).length > 0
    const hasProject = (context.projectHits || []).length > 0
    const hasSkill = (context.skillHits || []).length > 0

    const foundKinds = []
    if (hasBlog) foundKinds.push('blog')
    if (hasProject) foundKinds.push('project')
    if (hasSkill) foundKinds.push('skill')

    const pass = item.expectedAny.some((x) => foundKinds.includes(x))

    rows.push({
      prompt: item.prompt,
      expectedAny: item.expectedAny,
      foundKinds,
      pass,
      diagnostics: context.diagnostics || null,
    })
  }

  const passed = rows.filter((x) => x.pass).length
  const score = Number(((passed / rows.length) * 100).toFixed(2))

  const result = {
    total: rows.length,
    passed,
    score,
    generatedAt: new Date().toISOString(),
    rows,
  }

  console.log(JSON.stringify(result, null, 2))
}

run().catch((error) => {
  console.error('[rag-eval] failed:', error)
  process.exit(1)
})

