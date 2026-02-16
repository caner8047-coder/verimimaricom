// @ts-nocheck

export default function HeroPanel() {
  return (
    <section className="hero glass" aria-label="Hero panel">
      <span className="eyebrow">Cognitive Digital Platform</span>
      <h1>Veri, tasarım ve kodun kesişiminde yaşayan bir kişisel marka ekosistemi</h1>
      <p>
        Caner Ünal · Yapay Zeka · Veri Bilimi · Web Developer · E-ticaret · Grafik Tasarım ·
        Dijital Pazarlama
      </p>

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

