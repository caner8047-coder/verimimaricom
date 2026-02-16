// @ts-nocheck

export default function NavBar() {
  return (
    <header className="top-nav glass" aria-label="Main navigation">
      <a href="/" className="brand" aria-label="Veri Mimarı ana sayfa">
        <span className="dot" />
        <span>VERİ MİMARI</span>
      </a>
      <nav className="nav-links">
        <a href="#projeler">Vaka Analizleri</a>
        <a href="#blog">Yazılar</a>
        <a href="/labs">Labs</a>
        <a href="#yetkinlik">Teknoloji Yığını</a>
        <a href="/uyelik">Premium</a>
        <a href="#iletisim">İş Birliği</a>
      </nav>
    </header>
  )
}

