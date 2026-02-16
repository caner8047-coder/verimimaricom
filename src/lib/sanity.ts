// @ts-nocheck

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_API_TOKEN

function hasSanityConfig() {
  return Boolean(projectId && dataset)
}

export async function sanityFetch(query: string, params: Record<string, string | number> = {}) {
  if (!hasSanityConfig()) {
    return null
  }

  const search = new URLSearchParams({
    query,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [`$${k}`, String(v)])),
  })

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?${search.toString()}`

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 120 },
  })

  if (!res.ok) {
    return null
  }

  const json = await res.json()
  return json?.result ?? null
}

