// @ts-nocheck

const OPENAI_EMBEDDINGS_MODEL = process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small'

function hasVectorConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function createEmbedding(text: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDINGS_MODEL,
      input: String(text || '').slice(0, 8000),
    }),
  })

  if (!res.ok) return null
  const json = await res.json()
  return json?.data?.[0]?.embedding || null
}

export async function retrieveFromVectorStore(question: string, limit = 12) {
  if (!hasVectorConfig()) return null

  const embedding = await createEmbedding(question)
  if (!embedding) return null

  const url = `${process.env.SUPABASE_URL}/rest/v1/rpc/match_rag_documents`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      query_embedding: embedding,
      match_count: limit,
      match_threshold: 0.35,
    }),
  })

  if (!res.ok) return null
  const rows = await res.json()
  if (!Array.isArray(rows)) return null

  return rows.map((row: any) => ({
    id: row.id,
    kind: row.kind,
    title: row.title,
    excerpt: row.excerpt,
    slug: row.slug,
    _score: Number(row.similarity || 0),
    meta: row.metadata || {},
  }))
}

export async function upsertRagDocumentsToVectorStore(documents: any[]) {
  if (!hasVectorConfig()) {
    return { ok: false, reason: 'missing-supabase-config' }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { ok: false, reason: 'missing-openai-api-key' }
  }

  const items = []
  for (const doc of documents || []) {
    const text = `${doc.title || ''}\n${doc.excerpt || ''}`.trim()
    const embedding = await createEmbedding(text)
    if (!embedding) continue
    items.push({
      id: doc.id,
      kind: doc.kind,
      title: doc.title,
      excerpt: doc.excerpt,
      slug: doc.slug,
      metadata: doc.meta || {},
      embedding,
    })
  }

  if (!items.length) {
    return { ok: false, reason: 'no-embeddings-generated' }
  }

  const upsertRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rag_documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(items),
  })

  if (!upsertRes.ok) {
    return { ok: false, reason: 'vector-upsert-failed', status: upsertRes.status }
  }

  return { ok: true, upserted: items.length }
}

