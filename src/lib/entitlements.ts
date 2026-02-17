// @ts-nocheck
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Demo-only in-memory entitlement store.
 * Replace with PostgreSQL table in production.
 */
const activeMembers = new Set<string>()
const processedWebhookEvents = new Set<string>()
let loaded = false

function dbPath() {
  return path.join(process.cwd(), 'data', 'entitlements', 'members.json')
}

async function ensureLoaded() {
  if (loaded) return

  try {
    const raw = await fs.readFile(dbPath(), 'utf-8')
    const parsed = JSON.parse(raw)

    for (const email of parsed?.activeMembers || []) {
      const key = normalize(email)
      if (key) activeMembers.add(key)
    }

    for (const eventId of parsed?.processedWebhookEvents || []) {
      const key = String(eventId || '').trim()
      if (key) processedWebhookEvents.add(key)
    }
  } catch {
    // no-op: first boot
  }

  loaded = true
}

async function persist() {
  const file = dbPath()
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(
    file,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        activeMembers: [...activeMembers],
        processedWebhookEvents: [...processedWebhookEvents],
      },
      null,
      2,
    ),
    'utf-8',
  )
}

function normalize(email: string) {
  return (email || '').trim().toLowerCase()
}

export async function grantMembership(email: string) {
  await ensureLoaded()
  const key = normalize(email)
  if (key) {
    activeMembers.add(key)
    await persist()
  }
}

export async function hasMembership(email: string) {
  await ensureLoaded()
  const key = normalize(email)
  return key ? activeMembers.has(key) : false
}

export async function markWebhookProcessed(eventId: string) {
  await ensureLoaded()
  const id = String(eventId || '').trim()
  if (!id) return false
  if (processedWebhookEvents.has(id)) return false

  processedWebhookEvents.add(id)
  await persist()
  return true
}

