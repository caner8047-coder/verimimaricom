// @ts-nocheck

/**
 * Demo-only in-memory entitlement store.
 * Replace with PostgreSQL table in production.
 */
const activeMembers = new Set<string>()

function normalize(email: string) {
  return (email || '').trim().toLowerCase()
}

export function grantMembership(email: string) {
  const key = normalize(email)
  if (key) activeMembers.add(key)
}

export function hasMembership(email: string) {
  const key = normalize(email)
  return key ? activeMembers.has(key) : false
}

