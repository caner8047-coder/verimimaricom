// @ts-nocheck
import TrackLink from '@/components/analytics/TrackLink'

export default function PersonaQuickPaths() {
  return (
    <section className="persona-paths" aria-label="Persona bazlı hızlı geçişler">
      <article className="persona-card glass">
        <span className="eyebrow">Recruiter Path</span>
        <h3>Teknik Profili 60 Saniyede Değerlendir</h3>
        <p>Yetkinlik özetleri, vaka analizi derinliği ve çalışma yaklaşımını hızlıca inceleyin.</p>
        <TrackLink
          href="#yetkinlik"
          className="card-cta"
          eventName="persona_recruiter_path_click"
          payload={{ placement: 'persona_paths' }}
        >
          Teknik Özeti Gör
        </TrackLink>
      </article>

      <article className="persona-card glass">
        <span className="eyebrow">Business Path</span>
        <h3>İş Etkisi Üreten Çözümleri İncele</h3>
        <p>Dönüşüm odaklı vaka analizleri, metrik etkileri ve premium içerik akışına erişin.</p>
        <TrackLink
          href="#projeler"
          className="card-cta"
          eventName="persona_business_path_click"
          payload={{ placement: 'persona_paths' }}
        >
          Vaka Etkilerini Gör
        </TrackLink>
      </article>

      <article className="persona-card glass">
        <span className="eyebrow">Builder Path</span>
        <h3>Teknik Laboratuvar ve Notlara Geç</h3>
        <p>Canlı prototipler, mimari notlar ve Digital Garden içerikleriyle derine inin.</p>
        <TrackLink
          href="/labs"
          className="card-cta"
          eventName="persona_builder_path_click"
          payload={{ placement: 'persona_paths' }}
        >
          Labs'i Aç
        </TrackLink>
      </article>
    </section>
  )
}

