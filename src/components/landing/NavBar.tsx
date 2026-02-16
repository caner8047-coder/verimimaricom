// @ts-nocheck

export default function NavBar() {
  return (
    <header className="top-nav glass" aria-label="Main navigation">
      <a href="#" className="brand" aria-label="Veri Mimarı ana sayfa">
        <span className="dot" />
        <span>VERİ MİMARI</span>
      </a>
      <nav className="nav-links">
        <a href="#projeler">Projeler</a>
        <a href="#blog">Blog</a>
        <a href="/labs">Labs</a>
        <a href="#yetkinlik">Yetkinlikler</a>
        <a href="/uyelik">Üyelik</a>
        <a href="#iletisim">İletişim</a>
      </nav>
    </header>
  )
}

