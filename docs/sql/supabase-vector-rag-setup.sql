-- Veri Mimarı - Supabase Vector RAG Setup
-- Run this in Supabase SQL Editor (single execution).

begin;

create extension if not exists vector;

create table if not exists public.rag_documents (
  id text primary key,
  kind text not null,
  title text not null,
  excerpt text,
  slug text,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rag_documents_kind on public.rag_documents(kind);
create index if not exists idx_rag_documents_slug on public.rag_documents(slug);

-- NOTE: tune lists based on dataset size. 100 is a safe default starter.
create index if not exists idx_rag_documents_embedding_ivfflat
  on public.rag_documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_rag_documents_updated_at on public.rag_documents;
create trigger trg_rag_documents_updated_at
before update on public.rag_documents
for each row
execute function public.set_updated_at();

-- RPC used by app code in src/lib/rag/vector.ts
create or replace function public.match_rag_documents(
  query_embedding vector(1536),
  match_count int default 12,
  match_threshold float default 0.35
)
returns table (
  id text,
  kind text,
  title text,
  excerpt text,
  slug text,
  metadata jsonb,
  similarity float
)
language sql
stable
as $$
  select
    d.id,
    d.kind,
    d.title,
    d.excerpt,
    d.slug,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.rag_documents d
  where 1 - (d.embedding <=> query_embedding) >= match_threshold
  order by d.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

-- Optional grants for anon/authenticated read-only RPC access
grant execute on function public.match_rag_documents(vector(1536), int, float) to anon, authenticated;

commit;

