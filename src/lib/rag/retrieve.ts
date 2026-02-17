// @ts-nocheck

function normalize(text: string) {
  return String(text || '').toLocaleLowerCase('tr-TR')
}

function scoreByContains(haystack: string, needles: string[]) {
  const base = normalize(haystack)
  let score = 0

  for (const needle of needles) {
    if (!needle) continue
    if (base.includes(needle)) score += 1
  }

  return score
}

export function retrieveCandidates(documents: any[], userQuestion: string) {
  const tokens = normalize(userQuestion)
    .split(/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 2)

  return (documents || [])
    .map((doc: any) => ({
      ...doc,
      _score: scoreByContains(`${doc.title || ''} ${doc.excerpt || ''}`, tokens),
    }))
    .filter((doc: any) => doc._score >= 0)
}

