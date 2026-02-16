// @ts-nocheck

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
        <a href="#projeler" className="cta-link cta-primary">
          Öne Çıkan Vaka Analizleri
        </a>
        <a href="/uyelik" className="cta-link cta-secondary">
          Premium İçeriklere Eriş
        </a>
      </div>

      <div className="hero-badges" role="list" aria-label="Uzmanlık etiketleri">
        <span className="badge">AI & ML</span>
        <span className="badge">Data Storytelling</span>
        <span className="badge">Next.js Platform</span>
        <span className="badge">Digital Garden</span>
      </div>

      <div className="cmd-chip" aria-label="Komut paleti kısayolu">
        Komuta Merkezi <kbd>⌘</kbd>+<kbd>K</kbd>
      </div>
    </section>
  )
}

