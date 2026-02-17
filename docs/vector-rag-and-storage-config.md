# Vector RAG + Object Storage Config Guide

## 1) Vector RAG (Supabase pgvector style)

Implemented modules:
- Retriever integration: [`rag.ts`](zolm-main/brand-site/next/src/lib/rag.ts)
- Vector client: [`vector.ts`](zolm-main/brand-site/next/src/lib/rag/vector.ts)
- Ingestion command: [`rag-vector-ingest.mjs`](zolm-main/brand-site/next/scripts/rag-vector-ingest.mjs)

### Required environment variables

- `OPENAI_API_KEY`
- `OPENAI_EMBEDDINGS_MODEL` (optional, default: `text-embedding-3-small`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Expected Supabase objects

Table:
- `rag_documents`
  - `id` (text, primary key)
  - `kind` (text)
  - `title` (text)
  - `excerpt` (text)
  - `slug` (text)
  - `metadata` (jsonb)
  - `embedding` (vector)

RPC function:
- `match_rag_documents(query_embedding vector, match_count int, match_threshold float)`

### Ingestion

Run:
- `npm run rag:vector:ingest`

Fallback behavior:
- If vector config is missing or unavailable, system falls back to local retrieval modules.

## 2) Secure Object Storage Redirect (S3/R2 compatible)

Implemented modules:
- Presign helper: [`storage.ts`](zolm-main/brand-site/next/src/lib/storage.ts)
- Download route: [`assets/download`](zolm-main/brand-site/next/src/app/api/assets/download/route.ts)

### Required environment variables

- `S3_ENDPOINT` (e.g. `https://<account>.r2.cloudflarestorage.com`)
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

### Flow

1. Issue token (`mode=issue`) after membership check
2. Consume token (`mode=consume`)
3. Generate S3 Signature V4 presigned GET URL
4. Return `302` redirect to storage object

If storage config missing:
- API returns `503 storage-config-missing`

