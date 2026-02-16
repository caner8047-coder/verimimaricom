// @ts-nocheck

export default function BentoGrid({ cms }) {
  return (
    <section className="bento-grid" aria-label="Bento modüler ana panel">
      <article id="projeler" className="card glass span-8">
        <h3>Öne Çıkan Case Study</h3>
        <p>Sanity CMS üzerinden gelen proje/vaka çalışmaları:</p>
        <ul className="card-list">
          {cms.projects.map((project: any, index: number) => (
            <li key={project.slug || index}>
              <a href={project.slug ? `/projeler/${project.slug}` : '#'}>{project.title}</a>
              <small>{project.excerpt}</small>
            </li>
          ))}
        </ul>
      </article>

      <article id="blog" className="card glass span-4">
        <h3>Digital Garden Blog</h3>
        <p>Son yayınlanan yazılar:</p>
        <ul className="card-list compact">
          {cms.blogs.map((post: any, index: number) => (
            <li key={post.slug || index}>
              <a href={post.slug ? `/blog/${post.slug}` : '#'}>{post.title}</a>
              <small>{post.excerpt}</small>
            </li>
          ))}
        </ul>
      </article>

      <article id="yetkinlik" className="card glass span-4">
        <h3>Yetenek Takımyıldızı</h3>
        <p>Tech Stack verileri CMS'ten canlı çekiliyor:</p>
        <div className="skill-cloud">
          {cms.skills.map((skill: any, index: number) => (
            <span key={`${skill.name}-${index}`} className="skill-chip">
              {skill.name}
            </span>
          ))}
        </div>
      </article>

      <article id="lab" className="card glass span-4">
        <h3>Canlı Laboratuvar</h3>
        <p>Model demoları, prototipler ve yayınlanabilir deney notları için özel vitrin.</p>
      </article>

      <article id="kaynak" className="card glass span-4">
        <h3>Doküman ve Kaynak Merkezi</h3>
        <p>Sunum, rapor ve dosya paylaşımları için güvenli indirme altyapısı.</p>
      </article>

      <article id="iletisim" className="card glass span-8">
        <h3>İletişim ve İş Birliği</h3>
        <p>
          Hedef odaklı iletişim akışı: recruiter, müşteri ve teknik ziyaretçi için ayrı giriş
          noktaları.
        </p>
      </article>
    </section>
  )
}

