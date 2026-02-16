// @ts-nocheck
import TrackLink from '@/components/analytics/TrackLink'
import OpenCommandPaletteButton from '@/components/navigation/OpenCommandPaletteButton'

export default function HeroPanel() {
  return (
    <section className="hero glass" aria-label="Hero panel">
      <span className="eyebrow">Veri Mimarı · Strateji + Ürün + Yapay Zeka</span>
      <h1>Veriyi ölçülebilir büyüme çıktısına dönüştüren dijital ürün ve AI çözümleri</h1>
      <p>
        Caner Ünal; veri bilimi, yapay zeka ve web mühendisliğini birleştirerek case study odaklı,
        iş etkisi üreten platformlar tasarlar.
      </p>

      <div className="hero-cta-group" aria-label="Öne çıkan aksiyonlar">
        <TrackLink
          href="#projeler"
          className="cta-link cta-primary"
          eventName="cta_home_featured_cases_click"
          payload={{ placement: 'hero', cta: 'featured_cases' }}
        >
          Öne Çıkan Vaka Analizleri
        </TrackLink>
        <TrackLink
          href="/uyelik"
          className="cta-link cta-secondary"
          eventName="cta_home_premium_click"
          payload={{ placement: 'hero', cta: 'premium' }}
        >
          Premium İçeriklere Eriş
        </TrackLink>
      </div>

      <div className="hero-badges" role="list" aria-label="Uzmanlık etiketleri">
        <span className="badge">AI & ML</span>
        <span className="badge">Data Storytelling</span>
        <span className="badge">Next.js Platform</span>
        <span className="badge">Digital Garden</span>
      </div>

      <OpenCommandPaletteButton className="cmd-chip" source="hero-chip">
        Komuta Merkezi <kbd>⌘</kbd>+<kbd>K</kbd>
      </OpenCommandPaletteButton>
    </section>
  )
}

