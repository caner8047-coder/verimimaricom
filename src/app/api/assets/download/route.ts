// @ts-nocheck
import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { hasMembership } from '@/lib/entitlements'

export const runtime = 'nodejs'

const TOKEN_TTL_SECONDS = 15 * 60

function getSecret() {
  return process.env.ASSET_TOKEN_SECRET || 'dev-asset-token-secret'
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

function makeToken(email: string, asset: string, expiresAt: number) {
  const payload = `${email}|${asset}|${expiresAt}`
  const sig = signPayload(payload)
  return Buffer.from(`${payload}|${sig}`).toString('base64url')
}

function verifyToken(token: string) {
  try {
    const raw = Buffer.from(String(token || ''), 'base64url').toString('utf-8')
    const [email, asset, expRaw, signature] = raw.split('|')
    const expiresAt = Number(expRaw || 0)
    if (!email || !asset || !signature || !Number.isFinite(expiresAt)) return null
    if (Date.now() > expiresAt) return null

    const payload = `${email}|${asset}|${expiresAt}`
    const expected = signPayload(payload)
    if (expected !== signature) return null

    return { email, asset, expiresAt }
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('mode') || 'issue'

  if (mode === 'issue') {
    const email = String(url.searchParams.get('email') || '').trim().toLowerCase()
    const asset = String(url.searchParams.get('asset') || '').trim() || 'premium-pack.zip'

    if (!email) {
      return NextResponse.json({ ok: false, error: 'email-required' }, { status: 400 })
    }

    if (!(await hasMembership(email))) {
      return NextResponse.json({ ok: false, error: 'membership-required' }, { status: 403 })
    }

    const expiresAt = Date.now() + TOKEN_TTL_SECONDS * 1000
    const token = makeToken(email, asset, expiresAt)
    const downloadUrl = `/api/assets/download?mode=consume&token=${token}`

    return NextResponse.json({
      ok: true,
      token,
      expiresAt,
      downloadUrl,
    })
  }

  if (mode === 'consume') {
    const token = String(url.searchParams.get('token') || '')
    const verified = verifyToken(token)
    if (!verified) {
      return NextResponse.json({ ok: false, error: 'invalid-or-expired-token' }, { status: 401 })
    }

    // Demo response. In production, redirect to S3/R2 presigned URL.
    return NextResponse.json({
      ok: true,
      asset: verified.asset,
      message: 'Token valid. Replace this response with real object storage redirect.',
    })
  }

  return NextResponse.json({ ok: false, error: 'invalid-mode' }, { status: 400 })
}

