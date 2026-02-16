// @ts-nocheck
import { labsCatalog } from '@/lib/labs'
import LabEmbed from '@/components/labs/LabEmbed'
import GradioLoader from '@/components/labs/GradioLoader'

export default function LabsPage() {
  return (
    <main className="page labs-page" aria-label="Labs deney alanı">
      <GradioLoader />

      <section className="labs-hero glass">
        <span className="eyebrow">Phase 3 · Labs</span>
        <h1>Canlı AI Modelleri ve İnteraktif Deney Ortamı</h1>
        <p>
          Hugging Face (Gradio) ve Streamlit deneylerini doğrudan platform içine gömerek, portföyü
          statik sunumdan canlı bir laboratuvara dönüştürür.
        </p>
      </section>

      <section className="labs-grid" aria-label="Gömülü model kartları">
        {labsCatalog.map((item) => (
          <LabEmbed key={item.id} item={item} />
        ))}
      </section>
    </main>
  )
}

