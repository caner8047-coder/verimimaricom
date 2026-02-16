// @ts-nocheck
import Link from 'next/link'
import { cookies } from 'next/headers'
import { hasActiveMembership } from '@/lib/membership'

export default async function PremiumGate({
  title = 'Premium İçerik',
  preview = 'Bu içerik sadece aktif üyeler için görüntülenebilir.',
  children,
}: {
  title?: string
  preview?: string
  children: any
}) {
  const jar = await cookies()
  const isMember = hasActiveMembership(jar)

  if (isMember) {
    return <>{children}</>
  }

  return (
    <section className="case-block glass" aria-label="Kilitli içerik kutusu">
      <h2>{title}</h2>
      <div className="lock-box">
        <p>{preview}</p>
        <Link className="cta-link" href="/uyelik">
          Üyeliği Aktifleştir
        </Link>
      </div>
    </section>
  )
}

