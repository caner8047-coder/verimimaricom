// @ts-nocheck
'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { trackEvent } from '@/lib/analytics'

function formatAssistantContent(content: string) {
  const parts = String(content || '').split(/\n\s*\n/).filter(Boolean)

  return parts.map((block, index) => {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const looksLikeList = lines.length > 1 && lines.every((line) => line.startsWith('- ') || /^\d+\./.test(line))
    const looksLikeReferences = /^kaynaklar:?/i.test(lines[0] || '')

    if (looksLikeReferences) {
      return (
        <section key={`ref-${index}`} className="bubble-section refs">
          <strong>Kaynaklar</strong>
          <ul>
            {lines
              .slice(1)
              .map((line, i) => line.replace(/^[-*]\s*/, '').trim())
              .filter(Boolean)
              .map((line, i) => (
                <li key={`ref-item-${index}-${i}`}>{line}</li>
              ))}
          </ul>
        </section>
      )
    }

    if (looksLikeList) {
      return (
        <ul key={`list-${index}`} className="bubble-list">
          {lines.map((line, i) => (
            <li key={`line-${index}-${i}`}>{line.replace(/^[-*]\s*/, '').trim()}</li>
          ))}
        </ul>
      )
    }

    return (
      <p key={`p-${index}`}>
        {lines.join(' ')}
      </p>
    )
  })
}

export default function VeriBotChat() {
  const [open, setOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/veribot',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Merhaba, ben VeriBot. Projeler, vaka analizleri ve yetkinlikler hakkında soru sorabilirsiniz.',
      },
    ],
  })

  return (
    <div className={`veribot ${open ? 'open' : ''}`} aria-label="VeriBot chat widget">
      <button
        className="veribot-trigger glass"
        onClick={() => {
          const nextOpen = !open
          setOpen(nextOpen)
          trackEvent(nextOpen ? 'veribot_open' : 'veribot_close', {
            source: 'floating_widget',
          })
        }}
      >
        {open ? 'Kapat' : 'VeriBot'}
      </button>

      {open && (
        <section className="veribot-panel glass">
          <header className="veribot-head">
            <strong>Agentic AI Asistanı</strong>
            <span>RAG destekli · Proje + Blog + Skill</span>
          </header>

          <div className="veribot-stream" role="log" aria-live="polite">
            {messages.length <= 1 && !isLoading && (
              <div className="veribot-empty-state">
                <strong>Öneri sorular</strong>
                <ul>
                  <li>Bu sitede hangi vaka analizleri var?</li>
                  <li>NLP projelerinde hangi teknoloji yığını kullanıldı?</li>
                  <li>Premium üyelikte hangi içerikler açılıyor?</li>
                </ul>
              </div>
            )}

            {messages.map((m) => (
              <article key={m.id} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                {m.role === 'assistant' ? formatAssistantContent(m.content) : <p>{m.content}</p>}
              </article>
            ))}

            {isLoading && <div className="veribot-status">VeriBot yanıtı hazırlanıyor...</div>}

            {error && (
              <div className="veribot-status error">
                VeriBot şu anda yanıt üretemedi. Lütfen sorunuzu yeniden deneyin.
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              if (input.trim()) {
                trackEvent('veribot_submit', {
                  prompt_length: input.trim().length,
                })
              }
              handleSubmit(e)
            }}
            className="veribot-form"
          >
            <input
              name="prompt"
              value={input}
              onChange={handleInputChange}
              placeholder="Örn: NLP projelerinde hangi teknoloji yığınını kullandın?"
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? 'Yanıtlanıyor...' : 'Sor'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

