// @ts-nocheck
'use client'

import type { ReactNode } from 'react'
import { trackEvent } from '@/lib/analytics'

type OpenCommandPaletteButtonProps = {
  children: ReactNode
  className?: string
  source?: string
}

export default function OpenCommandPaletteButton({
  children,
  className,
  source = 'unknown',
}: OpenCommandPaletteButtonProps) {
  return (
    <button
      type="button"
      className={className}
      aria-label="Komuta Merkezini Aç"
      onClick={() => {
        trackEvent('command_palette_open_click', { source })
        window.dispatchEvent(new CustomEvent('command-palette:open'))
      }}
    >
      {children}
    </button>
  )
}

