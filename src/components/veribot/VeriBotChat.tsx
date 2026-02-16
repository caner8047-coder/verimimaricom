// @ts-nocheck
'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'

export default function VeriBotChat() {
  const [open, setOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
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
      <button className="veribot-trigger glass" onClick={() => setOpen((s) => !s)}>
        {open ? 'Kapat' : 'VeriBot'}
      </button>

      {open && (
        <section className="veribot-panel glass">
          <header className="veribot-head">
            <strong>Agentic AI Asistanı</strong>
            <span>RAG destekli · Proje + Blog + Skill</span>
          </header>

          <div className="veribot-stream" role="log" aria-live="polite">
            {messages.map((m) => (
              <article key={m.id} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                <p>{m.content}</p>
              </article>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="veribot-form">
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

