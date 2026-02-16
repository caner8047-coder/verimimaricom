// @ts-nocheck
import { getCaseStudyBySlug } from '@/lib/cms'
import MetricsBoard from '@/components/case-study/MetricsBoard'
import { getCaseStudyJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'
import PremiumGate from '@/components/membership/PremiumGate'
import MermaidDiagram from '@/components/case-study/MermaidDiagram'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getCaseStudyBySlug(slug)

  return {
    title: data?.title || 'Case Study',
    description: data?.excerpt || 'Veri hikayeciliği odaklı vaka analizi',
    alternates: {
      canonical: `/projeler/${slug}`,
    },
    openGraph: {
      type: 'article',
      title: data?.title || 'Case Study',
      description: data?.excerpt || 'Veri hikayeciliği odaklı vaka analizi',
      url: `/projeler/${slug}`,
    },
  }
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getCaseStudyBySlug(slug)
  const jsonLd = getCaseStudyJsonLd(data, slug)

  return (
    <main className="page case-study-page" aria-label="Case Study Detay Sayfası">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="case-header glass">
        <span className="eyebrow">Veri Hikayeciliği · Case Study</span>
        <h1>{data.title}</h1>
        <p>{data.excerpt}</p>

        <div className="case-meta">
          <span>Müşteri: {data.clientName || 'N/A'}</span>
          <span>Sektör: {data.industry || 'N/A'}</span>
          <span>Impact Score: {data.impactScore ?? '-'}</span>
        </div>

        <div className="case-links">
          {data.repoUrl && <a href={data.repoUrl}>Repo</a>}
          {data.demoUrl && <a href={data.demoUrl}>Demo</a>}
          <a href="/">Ana Sayfa</a>
        </div>
      </header>

      <section className="case-grid" aria-label="Vaka analizi içerik bölümleri">
        <article className="case-block glass case-col-8">
          <h2>Problem / Hipotez</h2>
          <p>{data.problemStatement || 'Problem tanımı henüz eklenmedi.'}</p>
        </article>

        <article className="case-block glass case-col-4">
          <h2>Metodoloji</h2>
          <p>{data.methodology || 'Metodoloji henüz eklenmedi.'}</p>
        </article>

        <article className="case-block glass case-col-8">
          <h2>Sonuçlar / Analiz</h2>
          <p>{data.outcomeSummary || 'Sonuç özeti henüz eklenmedi.'}</p>
          <MetricsBoard metrics={data.metrics || []} />
        </article>

        <article className="case-block glass case-col-4">
          <h2>Sistem Mimarisi Şeması (Mermaid)</h2>
          <p>Bu blok Sanity üzerinde tanımlanan Mermaid diyagramını dinamik olarak render eder.</p>
          <MermaidDiagram chart={data.architectureDiagramMermaid} />
        </article>

        <article className="case-col-12">
          <PremiumGate
            title="Premium Analitik Katmanı"
            preview="ROI formülleri, ileri segment analizleri ve ham veri indirme bağlantıları üyelik gerektirir."
          >
            <section className="case-block glass">
              <h2>Üyelere Özel İçerik</h2>
              <div className="premium-content">
                <p>
                  Burada gelişmiş dönüşüm kohortu, kanal bazlı maliyet kırılımı ve premium dashboard
                  bağlantıları gösterilir.
                </p>
              </div>
            </section>
          </PremiumGate>
        </article>
      </section>
    </main>
  )
}

