"use client"

// @ts-nocheck
import { trackEvent } from '@/lib/analytics'

export default function MembershipPage() {
  return (
    <main className="page membership-page" aria-label="Üyelik ve dijital varlık satışı sayfası">
      <section className="membership-card glass">
        <span className="eyebrow">Phase 2 · Digital Assets + Membership</span>
        <h1>Premium Üyelik ve Dijital Varlık Satışı</h1>
        <p>
          Bu altyapı ile belirli içerikleri kilitleyebilir, Lemon Squeezy checkout üzerinden ödeme
          alabilir ve üyelik doğrulaması sonrası içeriği açabilirsiniz.
        </p>

        <ul className="feature-list">
          <li>Kilitli içerik (PremiumGate) desteği</li>
          <li>Lemon Squeezy checkout yönlendirmesi</li>
          <li>Webhook ile üyelik hakedişi işleme</li>
          <li>E-posta ile üyelik aktifleme (unlock)</li>
        </ul>
      </section>

      <section className="membership-card glass">
        <h2>1) Ödeme ile Üyelik Başlat</h2>
        <p>E-posta girin ve checkout akışına yönlenin.</p>

        <form
          className="checkout-form"
          action="/api/commerce/checkout"
          method="GET"
          onSubmit={(e) => {
            const form = e.currentTarget as HTMLFormElement
            const email = (new FormData(form).get('email') || '').toString()

            trackEvent('membership_checkout_start', {
              placement: 'membership_page',
              has_email: Boolean(email),
              email_domain: email.includes('@') ? email.split('@')[1] : undefined,
            })
          }}
        >
          <input
            type="email"
            name="email"
            required
            placeholder="ornek@domain.com"
            aria-label="Üyelik e-posta"
          />
          <button type="submit">Lemon Checkout</button>
        </form>
      </section>

      <section className="membership-card glass">
        <h2>2) Üyelik Aktifleştir (Demo)</h2>
        <p>
          Webhook geldikten sonra aynı e-posta ile üyeliği aktifleştirin. Bu aşama demo amaçlıdır ve
          production'da gerçek kullanıcı oturumu + DB doğrulamasına taşınmalıdır.
        </p>

        <form
          className="unlock-form"
          onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const email = (new FormData(form).get('email') || '').toString()
            const res = await fetch('/api/membership/unlock', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            })

            if (res.ok) {
              trackEvent('membership_unlock_success', {
                placement: 'membership_page',
                email_domain: email.includes('@') ? email.split('@')[1] : undefined,
              })
              window.location.href = '/projeler/ornek-vaka'
            } else {
              trackEvent('membership_unlock_failed', {
                placement: 'membership_page',
                email_domain: email.includes('@') ? email.split('@')[1] : undefined,
              })
              alert('Üyelik doğrulanamadı. Ödeme webhook kaydını kontrol edin.')
            }
          }}
        >
          <input type="email" name="email" required placeholder="ornek@domain.com" />
          <button type="submit">Üyeliği Aç</button>
        </form>
      </section>
    </main>
  )
}

