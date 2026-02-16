// @ts-nocheck
import TrackLink from '@/components/analytics/TrackLink'

export default function BentoGrid({ cms }) {
  return (
    <section className="bento-grid" aria-label="Bento modüler ana panel">
      <article id="projeler" className="card glass span-8">
        <h3>Öne Çıkan Dönüşüm Vaka Analizleri</h3>
        <p>Gerçek problem, uygulanan çözüm ve ölçülebilir etki sonuçlarını inceleyin.</p>
        <ul className="card-list">
          {cms.projects.map((project: any, index: number) => (
            <li key={project.slug || index}>
              <a href={project.slug ? `/projeler/${project.slug}` : '#'}>{project.title}</a>
              <small>{project.excerpt}</small>
            </li>
          ))}
        </ul>
        <TrackLink
          className="card-cta"
          href="/projeler/ornek-vaka"
          eventName="cta_home_cases_all_click"
          payload={{ placement: 'bento', section: 'projeler' }}
        >
          Tüm Vaka Analizlerini Gör
        </TrackLink>
      </article>

      <article id="blog" className="card glass span-4">
        <h3>Digital Garden Yazıları</h3>
        <p>Veri hikayeciliği, ürün geliştirme ve AI uygulamaları üzerine son notlar.</p>
        <ul className="card-list compact">
          {cms.blogs.map((post: any, index: number) => (
            <li key={post.slug || index}>
              <a href={post.slug ? `/blog/${post.slug}` : '#'}>{post.title}</a>
              <small>{post.excerpt}</small>
            </li>
          ))}
        </ul>
        <TrackLink
          className="card-cta"
          href="/labs"
          eventName="cta_home_blog_discover_click"
          payload={{ placement: 'bento', section: 'blog' }}
        >
          Yazıları Keşfet
        </TrackLink>
      </article>

      <article id="yetkinlik" className="card glass span-4">
        <h3>Teknoloji Yığını ve Yetkinlik Haritası</h3>
        <p>Projelerde kullanılan araçlar, diller ve platformlar tek bakışta.</p>
        <div className="skill-cloud">
          {cms.skills.map((skill: any, index: number) => (
            <span key={`${skill.name}-${index}`} className="skill-chip">
              {skill.name}
            </span>
          ))}
        </div>
      </article>

      <article id="lab" className="card glass span-4">
        <h3>Canlı Laboratuvar ve Prototipler</h3>
        <p>Model demoları, hızlı deneyler ve ürünleşmeye hazır prototip yayınları.</p>
        <TrackLink
          className="card-cta"
          href="/labs"
          eventName="cta_home_labs_click"
          payload={{ placement: 'bento', section: 'lab' }}
        >
          Laboratuvara Git
        </TrackLink>
      </article>

      <article id="kaynak" className="card glass span-4">
        <h3>Doküman ve Kaynak Merkezi</h3>
        <p>Sunumlar, raporlar ve operasyonel dokümanlar için düzenli kaynak alanı.</p>
      </article>

      <article id="iletisim" className="card glass span-8">
        <h3>İş Birliği ve Danışmanlık</h3>
        <p>
          Yeni ürün geliştirme, veri odaklı dönüşüm ve AI entegrasyonu için iletişime geçin.
        </p>
        <TrackLink
          className="card-cta"
          href="mailto:info@verimimari.com"
          eventName="cta_home_contact_click"
          payload={{ placement: 'bento', section: 'iletisim' }}
        >
          İş Birliği Başlat
        </TrackLink>
      </article>
    </section>
  )
}

