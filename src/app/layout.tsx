// @ts-nocheck
import './globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import { brandProfile, getGlobalJsonLd, getSiteUrl } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const VeriBotChat = dynamic(() => import('@/components/veribot/VeriBotChat'), {
  ssr: false,
  loading: () => null,
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Veri Mimarı | Caner Ünal',
    template: '%s | Veri Mimarı',
  },
  description:
    'Yapay Zeka, Veri Bilimi, Web Geliştirme ve Dijital Pazarlama odağında modern kişisel marka platformu.',
  keywords: [
    'Veri Mimarı',
    'Caner Ünal',
    'Yapay Zeka',
    'Veri Bilimi',
    'Veri Analitiği',
    'Web Developer',
    'Dijital Pazarlama',
    'E-ticaret',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/tr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    title: 'Veri Mimarı | Caner Ünal',
    description: brandProfile.description,
    siteName: 'Veri Mimarı',
    images: [
      {
        url: brandProfile.image,
        width: 1200,
        height: 630,
        alt: 'Veri Mimarı - Caner Ünal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veri Mimarı | Caner Ünal',
    description: brandProfile.description,
    images: [brandProfile.image],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: { children: any }) {
  const jsonLd = getGlobalJsonLd()

  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        {jsonLd.map((schema, index) => (
          <script
            key={`global-schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {children}
        <VeriBotChat />
      </body>
    </html>
  )
}

