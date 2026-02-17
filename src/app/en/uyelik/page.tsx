"use client"

// @ts-nocheck
import { trackEvent } from '@/lib/analytics'

export default function MembershipPageEN() {
  return (
    <main className="page membership-page" aria-label="Membership and digital asset sales page">
      <section className="membership-card glass">
        <span className="eyebrow">Phase 2 · Digital Assets + Membership</span>
        <h1>Premium Membership and Digital Asset Sales</h1>
        <p>
          With this infrastructure, you can lock selected content, accept payments via Lemon
          Squeezy checkout, and unlock content after membership verification.
        </p>

        <ul className="feature-list">
          <li>Locked content support (PremiumGate)</li>
          <li>Lemon Squeezy checkout redirection</li>
          <li>Membership entitlement processing via webhook</li>
          <li>Membership activation with email (unlock)</li>
        </ul>
      </section>

      <section className="membership-card glass">
        <h2>1) Start Membership with Payment</h2>
        <p>Enter your email and continue to checkout flow.</p>

        <form
          className="checkout-form"
          action="/api/commerce/checkout"
          method="GET"
          onSubmit={(e) => {
            const form = e.currentTarget as HTMLFormElement
            const email = (new FormData(form).get('email') || '').toString()

            trackEvent('membership_checkout_start', {
              placement: 'membership_page_en',
              has_email: Boolean(email),
              email_domain: email.includes('@') ? email.split('@')[1] : undefined,
            })
          }}
        >
          <input
            type="email"
            name="email"
            required
            placeholder="example@domain.com"
            aria-label="Membership email"
          />
          <button type="submit">Lemon Checkout</button>
        </form>
      </section>

      <section className="membership-card glass">
        <h2>2) Activate Membership (Demo)</h2>
        <p>
          After webhook is received, activate membership with the same email. This step is for demo
          purposes and should be replaced in production with real session + DB verification.
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
                placement: 'membership_page_en',
                email_domain: email.includes('@') ? email.split('@')[1] : undefined,
              })
              window.location.href = '/projeler/ornek-vaka'
            } else {
              trackEvent('membership_unlock_failed', {
                placement: 'membership_page_en',
                email_domain: email.includes('@') ? email.split('@')[1] : undefined,
              })
              alert('Membership could not be verified. Please check webhook payment records.')
            }
          }}
        >
          <input type="email" name="email" required placeholder="example@domain.com" />
          <button type="submit">Unlock Membership</button>
        </form>
      </section>
    </main>
  )
}

