// @ts-nocheck
import { labsCatalog } from '@/lib/labs'
import LabEmbed from '@/components/labs/LabEmbed'
import GradioLoader from '@/components/labs/GradioLoader'

export default function LabsPageEN() {
  return (
    <main className="page labs-page" aria-label="Labs experimentation area">
      <GradioLoader />

      <section className="labs-hero glass">
        <span className="eyebrow">Phase 3 · Labs</span>
        <h1>Live AI Models and Interactive Experiment Environment</h1>
        <p>
          Embed Hugging Face (Gradio) and Streamlit experiments directly into the platform and
          transform the portfolio from a static presentation into a live laboratory.
        </p>
      </section>

      <section className="labs-grid" aria-label="Embedded model cards">
        {labsCatalog.map((item) => (
          <LabEmbed key={item.id} item={item} />
        ))}
      </section>
    </main>
  )
}

