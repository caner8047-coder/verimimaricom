// @ts-nocheck

const ACTION_HINT_TAG = /<ACTION_HINT>([\s\S]*?)<\/ACTION_HINT>/i

const ALLOWED_ACTIONS = new Set(['indir_cv', 'randevu_al', 'proje_bul', 'navigate'])

function safeParseJson(input: string) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

export function isSafeTarget(target: string) {
  const value = String(target || '').trim()
  if (!value) return false

  if (value.startsWith('/')) return true
  if (value.startsWith('#')) return true
  if (value.startsWith('mailto:')) return true
  if (/^https:\/\//i.test(value)) return true

  return false
}

export function normalizeActionHint(value: any) {
  if (!value || typeof value !== 'object') return null

  const action = String(value.action || '').trim()
  const target = String(value.target || '').trim()
  const reason = String(value.reason || '').trim()
  const label = String(value.label || '').trim()

  if (!ALLOWED_ACTIONS.has(action)) return null
  if (!isSafeTarget(target)) return null

  return {
    action,
    target,
    reason: reason || 'Önerilen aksiyonu uygula.',
    label: label || 'Aksiyonu Uygula',
  }
}

export function parseActionHintFromText(content: string) {
  const text = String(content || '')
  if (!text.trim()) return null

  const taggedMatch = text.match(ACTION_HINT_TAG)
  if (taggedMatch?.[1]) {
    const parsed = safeParseJson(taggedMatch[1].trim())
    return normalizeActionHint(parsed)
  }

  const fallbackMatch = text.match(/\{\s*"action"\s*:\s*"[^"]+"[\s\S]*?\}/)
  if (fallbackMatch?.[0]) {
    const parsed = safeParseJson(fallbackMatch[0])
    return normalizeActionHint(parsed)
  }

  return null
}

