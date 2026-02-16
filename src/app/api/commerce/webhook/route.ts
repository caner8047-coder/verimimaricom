// @ts-nocheck
import { NextResponse } from 'next/server'
import { verifyLemonSignature } from '@/lib/commerce'
import { grantMembership } from '@/lib/entitlements'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const raw = await req.text()
  const signature = req.headers.get('x-signature') || req.headers.get('X-Signature') || ''

  if (!verifyLemonSignature(raw, signature)) {
    return NextResponse.json({ ok: false, error: 'invalid-signature' }, { status: 401 })
  }

  let payload: any = null
  try {
    payload = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 })
  }

  const eventName = payload?.meta?.event_name
  const email =
    payload?.data?.attributes?.user_email ||
    payload?.data?.attributes?.customer_email ||
    payload?.data?.attributes?.email

  if (
    email &&
    (eventName === 'order_created' || eventName === 'subscription_created' || eventName === 'subscription_payment_success')
  ) {
    grantMembership(email)
  }

  return NextResponse.json({ ok: true })
}

