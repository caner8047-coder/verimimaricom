// @ts-nocheck
import crypto from 'node:crypto'

const lemonApi = 'https://api.lemonsqueezy.com/v1'

export function getLemonConfig() {
  return {
    apiKey: process.env.LEMON_SQUEEZY_API_KEY,
    storeId: process.env.LEMON_SQUEEZY_STORE_ID,
    webhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
    variantId: process.env.LEMON_SQUEEZY_VARIANT_ID,
  }
}

export async function createLemonCheckout(params: {
  email?: string
  variantId?: string
  successUrl?: string
  cancelUrl?: string
  custom?: Record<string, string>
}) {
  const { apiKey, storeId, variantId: envVariantId } = getLemonConfig()
  const variantId = params.variantId || envVariantId

  if (!apiKey || !storeId || !variantId) {
    return {
      url: params.successUrl || '/',
      mode: 'mock',
    }
  }

  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: params.email || undefined,
          custom: params.custom || {},
        },
        checkout_options: {
          embed: false,
          media: true,
          logo: true,
          desc: true,
        },
        product_options: {
          redirect_url: params.successUrl,
          receipt_button_text: 'Platforma Dön',
          receipt_link_url: params.successUrl,
          receipt_thank_you_note: 'Satın alımınız için teşekkürler.',
        },
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: String(storeId),
          },
        },
        variant: {
          data: {
            type: 'variants',
            id: String(variantId),
          },
        },
      },
    },
  }

  const res = await fetch(`${lemonApi}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    return {
      url: params.cancelUrl || '/',
      mode: 'fallback',
    }
  }

  const json = await res.json()

  return {
    url: json?.data?.attributes?.url || params.successUrl || '/',
    mode: 'live',
  }
}

export function verifyLemonSignature(rawBody: string, signature: string) {
  const { webhookSecret } = getLemonConfig()
  if (!webhookSecret || !signature) return false

  const digest = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
  const safeA = Buffer.from(digest)
  const safeB = Buffer.from(signature)
  if (safeA.length !== safeB.length) return false

  return crypto.timingSafeEqual(safeA, safeB)
}

