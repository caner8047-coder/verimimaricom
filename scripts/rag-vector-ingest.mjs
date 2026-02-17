import { buildRagCorpus } from '../src/lib/rag/ingest'
import { upsertRagDocumentsToVectorStore } from '../src/lib/rag/vector'

async function main() {
  const corpus = await buildRagCorpus()
  const result = await upsertRagDocumentsToVectorStore(corpus)

  console.log(
    JSON.stringify(
      {
        corpusSize: corpus.length,
        ...result,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error('[rag-vector-ingest] failed:', error)
  process.exit(1)
})

