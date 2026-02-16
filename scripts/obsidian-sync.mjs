import fs from 'node:fs/promises'
import path from 'node:path'

const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH
const OUTPUT_DIR = process.env.OBSIDIAN_SYNC_OUTPUT || './data/obsidian-sync'

function toSlug(input = '') {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function normalizeMaturity(raw = '') {
  const v = String(raw || '').toLowerCase().trim()
  if (v === 'growing') return 'growing'
  if (v === 'evergreen') return 'evergreen'
  return 'seed'
}

function parseFrontmatter(markdown = '') {
  const text = String(markdown)
  if (!text.startsWith('---\n')) return { meta: {}, body: text }

  const end = text.indexOf('\n---\n', 4)
  if (end === -1) return { meta: {}, body: text }

  const raw = text.slice(4, end)
  const body = text.slice(end + 5)
  const meta = {}

  raw.split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    meta[key] = value
  })

  return { meta, body }
}

async function collectMarkdownFiles(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectMarkdownFiles(full, acc)
      continue
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      acc.push(full)
    }
  }
  return acc
}

async function run() {
  if (!VAULT_PATH) {
    console.log('OBSIDIAN_VAULT_PATH tanımlı değil. Sync atlandı.')
    process.exit(0)
  }

  const files = await collectMarkdownFiles(VAULT_PATH)
  const synced = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { meta, body } = parseFrontmatter(raw)
    const tags = String(meta.tags || '')

    if (!tags.includes('#public')) continue

    const title = meta.title || path.basename(file, '.md')
    const slug = toSlug(meta.slug || title)
    const maturity = normalizeMaturity(meta.maturity)

    synced.push({
      title,
      slug,
      maturity,
      sourcePath: file,
      excerpt: String(meta.excerpt || '').trim(),
      content: body.trim(),
    })
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const outputPath = path.join(OUTPUT_DIR, 'public-notes.json')
  await fs.writeFile(outputPath, JSON.stringify({ generatedAt: new Date().toISOString(), notes: synced }, null, 2), 'utf-8')

  console.log(`Obsidian sync tamamlandı. ${synced.length} not yazıldı -> ${outputPath}`)
}

run().catch((err) => {
  console.error('Obsidian sync başarısız:', err)
  process.exit(1)
})

