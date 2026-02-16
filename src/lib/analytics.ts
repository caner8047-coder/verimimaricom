// @ts-nocheck

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    plausible?: (event: string, options?: { props?: AnalyticsPayload }) => void
    posthog?: { capture?: (event: string, props?: AnalyticsPayload) => void }
    umami?: { track?: (event: string, props?: AnalyticsPayload) => void }
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return

  const safeEvent = String(eventName || '').trim()
  if (!safeEvent) return

  const props = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', safeEvent, props)
    }

    if (typeof window.plausible === 'function') {
      window.plausible(safeEvent, { props })
    }

    if (window.posthog?.capture) {
      window.posthog.capture(safeEvent, props)
    }

    if (window.umami?.track) {
      window.umami.track(safeEvent, props)
    }
  } catch {
    // no-op: analytics failures should never break UX
  }
}

