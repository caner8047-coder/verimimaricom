import { buildRagCorpus } from '../src/lib/rag/ingest'

async function main() {
  const docs = await buildRagCorpus()

  const summary = {
    total: docs.length,
    blogs: docs.filter((d) => d.kind === 'blog').length,
    projects: docs.filter((d) => d.kind === 'project').length,
    skills: docs.filter((d) => d.kind === 'skill').length,
    generatedAt: new Date().toISOString(),
  }

  console.log(JSON.stringify(summary, null, 2))
}

main().catch((error) => {
  console.error('[rag-ingest] failed:', error)
  process.exit(1)
})

