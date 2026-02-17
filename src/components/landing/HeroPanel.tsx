// @ts-nocheck
import TrackLink from '@/components/analytics/TrackLink'
import OpenCommandPaletteButton from '@/components/navigation/OpenCommandPaletteButton'

function resolveHref(href: string, basePath: string) {
  if (String(href || '').startsWith('#')) {
    return basePath === '/' ? href : `${basePath}${href}`
  }
  return href
}

export default function HeroPanel({ t }) {
  return (
    <section className="hero glass" aria-label="Hero panel">
      <span className="eyebrow">{t.hero.eyebrow}</span>
      <h1>{t.hero.title}</h1>
      <p>{t.hero.description}</p>

      <div className="hero-cta-group" aria-label={t.hero.ctaAriaLabel}>
        <TrackLink
          href={resolveHref('#projeler', t.basePath)}
          className="cta-link cta-primary"
          eventName="cta_home_featured_cases_click"
          payload={{ placement: 'hero', cta: 'featured_cases' }}
        >
          {t.hero.featuredCases}
        </TrackLink>
        <TrackLink
          href="/uyelik"
          className="cta-link cta-secondary"
          eventName="cta_home_premium_click"
          payload={{ placement: 'hero', cta: 'premium' }}
        >
          {t.hero.premiumAccess}
        </TrackLink>
      </div>

      <div className="hero-badges" role="list" aria-label={t.hero.badgeAriaLabel}>
        <span className="badge">AI & ML</span>
        <span className="badge">Data Storytelling</span>
        <span className="badge">Next.js Platform</span>
        <span className="badge">Digital Garden</span>
      </div>

      <OpenCommandPaletteButton className="cmd-chip" source="hero-chip">
        {t.hero.commandCenterLabel} <kbd>⌘</kbd>+<kbd>K</kbd>
      </OpenCommandPaletteButton>
    </section>
  )
}

