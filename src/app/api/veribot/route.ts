// @ts-nocheck
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'
import { buildRagContext, toContextText } from '@/lib/rag'
import { detectActionIntent, executeToolByAction } from '@/lib/ai/tools'

export const runtime = 'nodejs'

/**
 * IMPORTANT:
 * - `x-auth-user-id` should be injected by trusted auth middleware/provider.
 * - Never trust client-provided `userId` alone.
 */
function getAuthenticatedUserId(req: Request) {
  const fromHeader = req.headers.get('x-auth-user-id') || req.headers.get('x-user-id')
  if (!fromHeader) return null
  return String(fromHeader).trim()
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return String(forwarded).split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown-ip'
}

function detectLocaleFromRequest(req: Request) {
  const explicit = req.headers.get('x-user-locale') || req.headers.get('x-locale')
  const referer = req.headers.get('referer') || ''
  const accept = req.headers.get('accept-language') || ''

  if (String(explicit).toLowerCase().startsWith('en')) return 'en'
  if (String(explicit).toLowerCase().startsWith('tr')) return 'tr'

  try {
    const url = new URL(referer)
    if (url.pathname.startsWith('/en')) return 'en'
  } catch {
    // no-op
  }

  if (String(accept).toLowerCase().includes('en')) return 'en'
  return 'tr'
}

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 18
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string) {
  const now = Date.now()
  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return { ok: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  rateLimitStore.set(key, existing)
  return { ok: true, remaining: RATE_LIMIT_MAX_REQUESTS - existing.count }
}

const SYSTEM_PROMPT = `
You are VeriBot, the agentic portfolio assistant for Caner Ünal.

Rules:
1) Answer in Turkish unless user explicitly asks another language.
2) Ground answers in the provided RAG context.
3) If information is not in context, say it clearly and suggest what to ask next.
4) Keep answers concise, useful, and professional.
5) When appropriate, mention relevant project slug or blog slug as navigation hints.
6) If a tool action context exists, prioritize that action guidance and include a direct next step.
7) Keep security/privacy boundaries: do not fabricate private data or credentials.

Response Contract:
- Bölüm 1: Kısa Yanıt
- Bölüm 2: Sonraki Adım (tek net aksiyon)
- Bölüm 3: Action Hint bloğu (zorunlu, tek satır JSON)
  <ACTION_HINT>{"action":"...","target":"...","reason":"...","label":"..."}</ACTION_HINT>
`.trim()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body?.messages || []
    const userId = body?.userId ? String(body.userId).trim() : ''

    const authUserId = getAuthenticatedUserId(req)
    const ip = getClientIp(req)
    const locale = detectLocaleFromRequest(req)

    // Security patch: prevent user impersonation
    if (!authUserId || !userId || userId !== authUserId) {
      return NextResponse.json(
        {
          error: 'Unauthorized: User ID mismatch',
        },
        { status: 401 },
      )
    }

    const rateKey = `${authUserId}:${ip}`
    const rate = checkRateLimit(rateKey)
    if (!rate.ok) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Lütfen kısa bir süre sonra tekrar deneyin.',
          retryAfterMs: Math.max((rate.resetAt || 0) - Date.now(), 1000),
        },
        { status: 429 },
      )
    }

    const lastUser = [...messages].reverse().find((m: any) => m?.role === 'user')
    const userQuestion = lastUser?.content || ''
    const detectedAction = detectActionIntent(userQuestion)
    const toolResult = detectedAction ? executeToolByAction(detectedAction, userQuestion) : null

    const rag = await buildRagContext(userQuestion)
    const ragContext = toContextText(rag)

    const actionContextText = toolResult
      ? `\n\nACTION CONTEXT:\n${toolResult.context}\nUse this action payload exactly in <ACTION_HINT>: ${JSON.stringify(
          {
            action: toolResult.action,
            target: toolResult.target,
            reason: toolResult.reason,
            label: toolResult.label,
          },
        )}`
      : ''

    const localeInstruction =
      locale === 'en'
        ? 'LANGUAGE MODE: Respond in English unless user explicitly asks Turkish.'
        : 'LANGUAGE MODE: Respond in Turkish unless user explicitly asks another language.'

    const result = streamText({
      model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
      system: `${SYSTEM_PROMPT}\n\n${localeInstruction}\n\nRAG CONTEXT:\n${ragContext}${actionContextText}`,
      messages,
      temperature: 0.3,
    })

    return result.toDataStreamResponse()
  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: 'VeriBot geçici olarak yanıt üretemedi.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}

