// @ts-nocheck
import OpenCommandPaletteButton from '@/components/navigation/OpenCommandPaletteButton'

function resolveHref(href: string, basePath: string) {
  if (String(href || '').startsWith('#')) {
    return basePath === '/' ? href : `${basePath}${href}`
  }
  return href
}

export default function NavBar({ t }) {
  return (
    <header className="top-nav glass" aria-label={t.nav.ariaLabel}>
      <a href={t.basePath} className="brand" aria-label={t.nav.brandAriaLabel}>
        <span className="dot" />
        <span>{t.nav.brandText}</span>
      </a>
      <nav className="nav-links">
        {t.nav.links.map((item: any, idx: number) => (
          <a key={`${item.href}-${idx}`} href={resolveHref(item.href, t.basePath)}>
            {item.label}
          </a>
        ))}
        <span className="lang-switch" aria-label="Language switcher">
          <a
            href={t.nav.languageSwitch.trHref}
            className={t.locale === 'tr' ? 'active' : ''}
            aria-current={t.locale === 'tr' ? 'page' : undefined}
          >
            {t.nav.languageSwitch.trLabel}
          </a>
          <a
            href={t.nav.languageSwitch.enHref}
            className={t.locale === 'en' ? 'active' : ''}
            aria-current={t.locale === 'en' ? 'page' : undefined}
          >
            {t.nav.languageSwitch.enLabel}
          </a>
        </span>
        <OpenCommandPaletteButton className="nav-cmdk" source="navbar">
          {t.nav.commandCenterLabel}
        </OpenCommandPaletteButton>
      </nav>
    </header>
  )
}

