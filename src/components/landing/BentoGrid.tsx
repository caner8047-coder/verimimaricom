// @ts-nocheck
import TrackLink from '@/components/analytics/TrackLink'

function resolveHref(href: string, basePath: string) {
  if (String(href || '').startsWith('#')) {
    return basePath === '/' ? href : `${basePath}${href}`
  }
  return href
}

export default function BentoGrid({ cms, t }) {
  const maturityLabel = (value: string) => {
    const v = String(value || '').toLowerCase()
    if (v === 'evergreen') return t.bento.maturity.evergreen
    if (v === 'growing') return t.bento.maturity.growing
    return t.bento.maturity.seed
  }

  return (
    <section className="bento-grid" aria-label={t.bento.ariaLabel}>
      <article id="projeler" className="card glass span-8">
        <h3>{t.bento.projects.title}</h3>
        <p>{t.bento.projects.description}</p>
        <ul className="card-list">
          {cms.projects.map((project: any, index: number) => (
            <li key={project.slug || index}>
              <a href={project.slug ? `/projeler/${project.slug}` : '#'}>{project.title}</a>
              <small>{project.excerpt}</small>
              <span className={`maturity-chip ${project.maturity || 'seed'}`}>
                {maturityLabel(project.maturity)}
              </span>
            </li>
          ))}
        </ul>
        <TrackLink
          className="card-cta"
          href="/projeler/ornek-vaka"
          eventName="cta_home_cases_all_click"
          payload={{ placement: 'bento', section: 'projeler' }}
        >
          {t.bento.projects.allCasesCta}
        </TrackLink>
      </article>

      <article id="blog" className="card glass span-4">
        <h3>{t.bento.blog.title}</h3>
        <p>{t.bento.blog.description}</p>
        <ul className="card-list compact">
          {cms.blogs.map((post: any, index: number) => (
            <li key={post.slug || index}>
              <a href={post.slug ? `/blog/${post.slug}` : '#'}>{post.title}</a>
              <small>{post.excerpt}</small>
              <span className={`maturity-chip ${post.maturity || 'seed'}`}>
                {maturityLabel(post.maturity)}
              </span>
            </li>
          ))}
        </ul>
        <TrackLink
          className="card-cta"
          href={t.bento.blog.ctaHref || '/labs'}
          eventName="cta_home_blog_discover_click"
          payload={{ placement: 'bento', section: 'blog' }}
        >
          {t.bento.blog.cta}
        </TrackLink>
      </article>

      <article id="yetkinlik" className="card glass span-4">
        <h3>{t.bento.skills.title}</h3>
        <p>{t.bento.skills.description}</p>
        <div className="skill-cloud">
          {cms.skills.map((skill: any, index: number) => (
            <span key={`${skill.name}-${index}`} className="skill-chip">
              {skill.name}
            </span>
          ))}
        </div>
      </article>

      <article id="lab" className="card glass span-4">
        <h3>{t.bento.labs.title}</h3>
        <p>{t.bento.labs.description}</p>
        <TrackLink
          className="card-cta"
          href={t.bento.labs.ctaHref || '/labs'}
          eventName="cta_home_labs_click"
          payload={{ placement: 'bento', section: 'lab' }}
        >
          {t.bento.labs.cta}
        </TrackLink>
      </article>

      <article id="kaynak" className="card glass span-4">
        <h3>{t.bento.resources.title}</h3>
        <p>{t.bento.resources.description}</p>
      </article>

      <article id="iletisim" className="card glass span-8">
        <h3>{t.bento.contact.title}</h3>
        <p>{t.bento.contact.description}</p>
        <TrackLink
          className="card-cta"
          href="mailto:info@verimimari.com"
          eventName="cta_home_contact_click"
          payload={{ placement: 'bento', section: 'iletisim' }}
        >
          {t.bento.contact.cta}
        </TrackLink>
      </article>
    </section>
  )
}

