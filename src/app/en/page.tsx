// @ts-nocheck
import NavBar from '@/components/landing/NavBar'
import HeroPanel from '@/components/landing/HeroPanel'
import BentoGrid from '@/components/landing/BentoGrid'
import PersonaQuickPaths from '@/components/landing/PersonaQuickPaths'
import CommandPalette from '@/components/navigation/CommandPalette'
import { getHomeCmsData, getKnowledgeGraphData } from '@/lib/cms'
import KnowledgeGraph from '@/components/garden/KnowledgeGraph'
import { getDictionary } from '@/lib/i18n'

export default async function HomePageEN() {
  const cms = await getHomeCmsData()
  const graph = await getKnowledgeGraphData()
  const t = getDictionary('en')

  return (
    <main className="page" aria-label="Data Architect home page" data-locale={t.locale}>
      <NavBar t={t} />
      <HeroPanel t={t} />
      <PersonaQuickPaths t={t} />
      <BentoGrid cms={cms} t={t} />

      <section
        id="knowledge-graph"
        className="garden-panel glass"
        aria-label={t.knowledgeGraph.sectionAriaLabel}
      >
        <div className="garden-head">
          <span className="eyebrow">{t.knowledgeGraph.eyebrow}</span>
          <h2>{t.knowledgeGraph.title}</h2>
          <p>{t.knowledgeGraph.description}</p>
          <div className="maturity-legend" aria-label={t.knowledgeGraph.maturityAriaLabel}>
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

