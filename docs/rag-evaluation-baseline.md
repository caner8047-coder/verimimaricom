# RAG Evaluation Baseline (V1.3 Sprint 2)

## Scope

This baseline documents the first structured RAG split and eval setup:

- Ingest layer: [`ingest.ts`](zolm-main/brand-site/next/src/lib/rag/ingest.ts)
- Retrieve layer: [`retrieve.ts`](zolm-main/brand-site/next/src/lib/rag/retrieve.ts)
- Rank layer: [`rank.ts`](zolm-main/brand-site/next/src/lib/rag/rank.ts)
- Public facade: [`rag.ts`](zolm-main/brand-site/next/src/lib/rag.ts)

## Scripts

- Corpus ingest summary: [`rag-ingest.mjs`](zolm-main/brand-site/next/scripts/rag-ingest.mjs)
- Eval run output: [`rag-eval.mjs`](zolm-main/brand-site/next/scripts/rag-eval.mjs)

## Initial Evaluation Set

Current eval set includes representative prompts for:

1. NLP discovery intent
2. Case-study recommendation intent
3. Tech-stack intent

Scoring model (baseline):
- pass/fail per prompt based on expected hit-kind presence
- aggregate percentage score

## Next Iteration Targets

1. Expand eval set to 50 prompts (TR/EN mix)
2. Add precision@k and recall@k computation
3. Store historical scores per commit for regression tracking
4. Add retrieval latency stats and p95 monitoring

## Operational Note

This baseline is intentionally lightweight and deterministic. Vector-store backed retrieval will be introduced in the next step while preserving this script-level regression harness.

