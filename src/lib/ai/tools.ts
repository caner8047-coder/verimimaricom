// @ts-nocheck

function normalizeQuestion(question: string) {
  return String(question || '').trim()
}

export function detectActionIntent(question: string) {
  const q = normalizeQuestion(question).toLowerCase()
  if (!q) return null

  const cvRegex = /(cv|özgeçmiş|ozgecmis|resume|indir)/i
  const meetingRegex = /(randevu|toplantı|toplanti|görüşme|gorusme|takvim|calendly|müsait|musait)/i
  const projectRegex = /(proje|vaka|case study|örnek vaka|ornek vaka|portfolio|portföy)/i

  if (cvRegex.test(q)) return 'indir_cv'
  if (meetingRegex.test(q)) return 'randevu_al'
  if (projectRegex.test(q)) return 'proje_bul'

  return null
}

function toolIndirCv() {
  const target = process.env.NEXT_PUBLIC_CV_URL || '/Caner-Unal-CV.pdf'
  return {
    action: 'indir_cv',
    target,
    reason: 'Kullanıcı CV/özgeçmiş talep etti.',
    label: 'CV İndir',
    context: `ToolResult(indir_cv): CV bağlantısı hazır: ${target}`,
  }
}

function toolRandevuAl() {
  const target = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://cal.com'
  return {
    action: 'randevu_al',
    target,
    reason: 'Kullanıcı toplantı/randevu talep etti.',
    label: 'Takvim Aç',
    context: `ToolResult(randevu_al): Takvim bağlantısı hazır: ${target}`,
  }
}

function toolProjeBul(question: string) {
  const q = normalizeQuestion(question).toLowerCase()

  let target = '/projeler/ornek-vaka'
  let label = 'Örnek Vaka Aç'
  let reason = 'Kullanıcı proje/vaka önerisi istedi.'

  if (/labs|demo|prototip|prototype/.test(q)) {
    target = '/labs'
    label = 'Labs Aç'
    reason = 'Kullanıcı laboratuvar/prototip odaklı içerik istedi.'
  } else if (/blog|yazı|not|garden/.test(q)) {
    target = '/#blog'
    label = 'Yazılara Git'
    reason = 'Kullanıcı içerik/yazı odaklı yönlendirme istedi.'
  }

  return {
    action: 'proje_bul',
    target,
    reason,
    label,
    context: `ToolResult(proje_bul): Önerilen hedef: ${target}. Kullanıcı sorusu: ${question}`,
  }
}

const TOOL_REGISTRY = {
  indir_cv: () => toolIndirCv(),
  randevu_al: () => toolRandevuAl(),
  proje_bul: (question: string) => toolProjeBul(question),
}

export function executeToolByAction(action: string, question: string) {
  const fn = TOOL_REGISTRY[String(action || '').trim()]
  if (!fn) return null
  return fn(question)
}

