// @ts-nocheck
import NavBar from '@/components/landing/NavBar'
import HeroPanel from '@/components/landing/HeroPanel'
import BentoGrid from '@/components/landing/BentoGrid'
import PersonaQuickPaths from '@/components/landing/PersonaQuickPaths'
import CommandPalette from '@/components/navigation/CommandPalette'
import { getHomeCmsData } from '@/lib/cms'
import { getKnowledgeGraphData } from '@/lib/cms'
import KnowledgeGraph from '@/components/garden/KnowledgeGraph'

export default async function HomePage() {
  const cms = await getHomeCmsData()
  const graph = await getKnowledgeGraphData()

  return (
    <main className="page" aria-label="Veri Mimarı ana sayfa">
      <NavBar />
      <HeroPanel />
      <PersonaQuickPaths />
      <BentoGrid cms={cms} />

      <section
        id="knowledge-graph"
        className="garden-panel glass"
        aria-label="Dijital Bahçe bilgi grafiği"
      >
        <div className="garden-head">
          <span className="eyebrow">Digital Garden · Knowledge Graph</span>
          <h2>Blog ve Notlar Arası Organik Bilgi Ağı</h2>
          <p>
            Düğümler içerikleri, çizgiler içerikler arası ilişkileri temsil eder. Bir düğüme tıklayarak
            ilgili yazıya geçiş yapabilirsiniz.
          </p>
          <div className="maturity-legend" aria-label="İçerik olgunluk seviyeleri">
            <span className="maturity-chip seed">Seed</span>
            <span className="maturity-chip growing">Growing</span>
            <span className="maturity-chip evergreen">Evergreen</span>
          </div>
        </div>
        <KnowledgeGraph graph={graph} />
      </section>
      <CommandPalette />
    </main>
  )
}

