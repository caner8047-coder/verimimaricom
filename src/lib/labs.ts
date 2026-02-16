// @ts-nocheck

export type LabItem = {
  id: string
  title: string
  description: string
  type: 'gradio' | 'streamlit'
  src: string
  tags?: string[]
}

/**
 * Replace `src` values with your real Hugging Face Spaces / Streamlit URLs.
 */
export const labsCatalog: LabItem[] = [
  {
    id: 'ai-text-lab',
    title: 'NLP Duygu Analizi Laboratuvarı',
    description:
      'Metin girdisinden duygu analizi yapan Gradio tabanlı model demosu. Veri hikayeciliği için anlık çıktılar üretir.',
    type: 'gradio',
    src: 'https://huggingface.co/spaces/gradio/hello_world',
    tags: ['NLP', 'AI', 'Gradio'],
  },
  {
    id: 'vision-lab',
    title: 'Görsel Üretim / Prompt Lab',
    description:
      'Prompt tabanlı görsel denemeleri için Hugging Face Space gömüsü. Tasarım ve AI kesişimi için vitrin alanı.',
    type: 'gradio',
    src: 'https://huggingface.co/spaces/huggingface-projects/llama-2-7b-chat',
    tags: ['Vision', 'Prompting', 'Labs'],
  },
  {
    id: 'streamlit-dashboard',
    title: 'Canlı Analitik Dashboard (Streamlit)',
    description:
      'Streamlit tabanlı veri analitiği panelini site içinde güvenli iframe ile sunar.',
    type: 'streamlit',
    src: 'https://share.streamlit.io/streamlit/demo-self-driving/main/app.py',
    tags: ['Streamlit', 'Analytics', 'Dashboard'],
  },
]

