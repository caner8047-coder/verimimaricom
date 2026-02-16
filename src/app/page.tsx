// @ts-nocheck
import NavBar from '@/components/landing/NavBar'
import HeroPanel from '@/components/landing/HeroPanel'
import BentoGrid from '@/components/landing/BentoGrid'
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
      <BentoGrid cms={cms} />

      <section className="garden-panel glass" aria-label="Dijital Bahçe bilgi grafiği">
        <div className="garden-head">
          <span className="eyebrow">Digital Garden · Knowledge Graph</span>
          <h2>Blog ve Notlar Arası Organik Bilgi Ağı</h2>
          <p>
            Düğümler içerikleri, çizgiler içerikler arası ilişkileri temsil eder. Bir düğüme tıklayarak
            ilgili yazıya geçiş yapabilirsiniz.
          </p>
        </div>
        <KnowledgeGraph graph={graph} />
      </section>
    </main>
  )
}

