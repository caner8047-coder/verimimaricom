// @ts-nocheck

export default function LabEmbed({ item }: { item: any }) {
  const isGradio = item.type === 'gradio'

  return (
    <article className="lab-card glass" id={item.id}>
      <header className="lab-head">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </header>

      <div className="lab-tags">
        {(item.tags || []).map((tag: string) => (
          <span key={`${item.id}-${tag}`} className="badge">
            {tag}
          </span>
        ))}
      </div>

      <div className="lab-frame-wrap" aria-label={`${item.title} embed`}>
        {isGradio ? (
          <gradio-app src={item.src} />
        ) : (
          <iframe
            src={item.src}
            title={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            allow="fullscreen"
          />
        )}
      </div>
    </article>
  )
}

