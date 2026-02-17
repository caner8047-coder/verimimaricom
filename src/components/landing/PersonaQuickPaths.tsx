// @ts-nocheck
import TrackLink from '@/components/analytics/TrackLink'

function resolveHref(href: string, basePath: string) {
  if (String(href || '').startsWith('#')) {
    return basePath === '/' ? href : `${basePath}${href}`
  }
  return href
}

export default function PersonaQuickPaths({ t }) {
  return (
    <section className="persona-paths" aria-label={t.persona.sectionAriaLabel}>
      {t.persona.cards.map((card: any, index: number) => (
        <article key={`${card.eventName}-${index}`} className="persona-card glass">
          <span className="eyebrow">{card.eyebrow}</span>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          <TrackLink
            href={resolveHref(card.href, t.basePath)}
            className="card-cta"
            eventName={card.eventName}
            payload={{ placement: 'persona_paths' }}
          >
            {card.cta}
          </TrackLink>
        </article>
      ))}
    </section>
  )
}

