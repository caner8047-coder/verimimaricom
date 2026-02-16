// @ts-nocheck
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { buildRagContext, toContextText } from '@/lib/rag'

export const runtime = 'nodejs'

const SYSTEM_PROMPT = `
You are VeriBot, the agentic portfolio assistant for Caner Ünal.

Rules:
1) Answer in Turkish unless user explicitly asks another language.
2) Ground answers in the provided RAG context.
3) If information is not in context, say it clearly and suggest what to ask next.
4) Keep answers concise, useful, and professional.
5) When appropriate, mention relevant project slug or blog slug as navigation hints.
`.trim()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body?.messages || []

    const lastUser = [...messages].reverse().find((m: any) => m?.role === 'user')
    const userQuestion = lastUser?.content || ''

    const rag = await buildRagContext(userQuestion)
    const ragContext = toContextText(rag)

    const result = streamText({
      model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
      system: `${SYSTEM_PROMPT}\n\nRAG CONTEXT:\n${ragContext}`,
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

