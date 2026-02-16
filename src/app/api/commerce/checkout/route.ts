// @ts-nocheck
import { NextResponse } from 'next/server'
import { createLemonCheckout } from '@/lib/commerce'
import { getSiteUrl } from '@/lib/seo'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email') || undefined
  const plan = url.searchParams.get('plan') || 'membership-monthly'
  const siteUrl = getSiteUrl()

  const checkout = await createLemonCheckout({
    email,
    successUrl: `${siteUrl}/uyelik/basarili`,
    cancelUrl: `${siteUrl}/uyelik`,
    custom: {
      plan,
      source: 'veri-mimari-platform',
    },
  })

  return NextResponse.redirect(checkout.url)
}

