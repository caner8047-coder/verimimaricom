// @ts-nocheck
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { hasMembership } from '@/lib/entitlements'
import { MEMBER_COOKIE, membershipCookieOptions } from '@/lib/membership'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const email = String(body?.email || '').trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ ok: false, error: 'email-required' }, { status: 400 })
  }

  if (!hasMembership(email)) {
    return NextResponse.json({ ok: false, error: 'membership-not-found' }, { status: 403 })
  }

  const jar = await cookies()
  jar.set(MEMBER_COOKIE, 'active', membershipCookieOptions())

  return NextResponse.json({ ok: true })
}

