// @ts-nocheck
'use client'

import { useEffect, useMemo, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

const COMMAND_ITEMS = [
  { id: 'cases', label: 'Vaka Analizleri', hint: 'Öne çıkan case study bölümü', href: '#projeler' },
  { id: 'blog', label: 'Yazılar', hint: 'Digital Garden yazıları', href: '#blog' },
  { id: 'stack', label: 'Teknoloji Yığını', hint: 'Yetenek ve stack görünümü', href: '#yetkinlik' },
  { id: 'labs', label: 'Labs', hint: 'Canlı laboratuvar ve prototipler', href: '/labs' },
  { id: 'premium', label: 'Premium Üyelik', hint: 'Üyelik ve unlock akışı', href: '/uyelik' },
  { id: 'contact', label: 'İş Birliği', hint: 'İletişim ve iş birliği', href: '#iletisim' },
  { id: 'graph', label: 'Knowledge Graph', hint: 'Bilgi ağı görselleştirmesi', href: '#knowledge-graph' },
  { id: 'home', label: 'Ana Sayfa', hint: 'Başlangıç ekranı', href: '/' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMAND_ITEMS
    return COMMAND_ITEMS.filter((item) => {
      return `${item.label} ${item.hint} ${item.href}`.toLowerCase().includes(q)
    })
  }, [query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, open])

  useEffect(() => {
    const openHandler = () => {
      setOpen(true)
      trackEvent('command_palette_open', { source: 'custom-event' })
    }

    const keyHandler = (e: KeyboardEvent) => {
      const cmdk = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (cmdk) {
        e.preventDefault()
        setOpen((prev) => {
          const next = !prev
          trackEvent(next ? 'command_palette_open' : 'command_palette_close', {
            source: 'keyboard',
          })
          return next
        })
      }

      if (!open) return

      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        trackEvent('command_palette_close', { source: 'escape' })
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }

      if (e.key === 'Enter') {
        const selected = filtered[activeIndex]
        if (selected) {
          e.preventDefault()
          trackEvent('command_palette_select', {
            command_id: selected.id,
            href: selected.href,
            source: 'keyboard',
          })
          window.location.href = selected.href
        }
      }
    }

    window.addEventListener('command-palette:open', openHandler)
    window.addEventListener('keydown', keyHandler)

    return () => {
      window.removeEventListener('command-palette:open', openHandler)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [open, filtered, activeIndex])

  if (!open) return null

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <section className="cmdk-panel glass" onClick={(e) => e.stopPropagation()} aria-label="Komuta Merkezi">
        <header className="cmdk-head">
          <strong>Komuta Merkezi</strong>
          <span>Hızlı gezinme · Cmd/Ctrl + K</span>
        </header>

        <input
          autoFocus
          className="cmdk-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Örn: Vaka analizleri, Labs, Premium"
        />

        <div className="cmdk-list" role="listbox" aria-label="Komut listesi">
          {filtered.length === 0 && <div className="cmdk-empty">Eşleşme bulunamadı.</div>}

          {filtered.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`cmdk-item ${index === activeIndex ? 'active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                trackEvent('command_palette_select', {
                  command_id: item.id,
                  href: item.href,
                  source: 'mouse',
                })
                window.location.href = item.href
              }}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

