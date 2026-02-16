# Veri Mimarı Platformu - Vercel Prod Checklist

## 1) Environment Variables

Vercel Project Settings > Environment Variables alanına aşağıdakileri ekleyin:

- NEXT_PUBLIC_SITE_URL
- SANITY_PROJECT_ID
- SANITY_DATASET
- SANITY_API_VERSION
- SANITY_API_TOKEN
- OPENAI_API_KEY
- OPENAI_MODEL
- LEMON_SQUEEZY_API_KEY
- LEMON_SQUEEZY_STORE_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET
- LEMON_SQUEEZY_VARIANT_ID

Referans dosya: `.env.example`

## 2) Domain ve Canonical

- Vercel'e üretim domainini bağlayın.
- NEXT_PUBLIC_SITE_URL değerini üretim domaini ile birebir eşleyin (https dahil).

## 3) Lemon Squeezy Webhook

Lemon Squeezy panelinde webhook URL:

- `https://<domain>/api/commerce/webhook`

İzlenecek olaylar:

- order_created
- subscription_created
- subscription_payment_success

## 4) Sanity İçerik Kontrolü

- `contentBase`, `blogPost`, `caseStudy`, `skill` dokümanlarının yayınlı olduğundan emin olun.
- `caseStudy` kayıtlarında `architectureDiagramMermaid` doluysa diyagram otomatik render edilir.

## 5) Robots / Sitemap

- `/robots.txt` ve `/sitemap.xml` endpointlerini canlıda doğrulayın.

## 6) Performans ve Stabilite

- Lighthouse (mobile + desktop) ölçümleri alın.
- Kritik sayfalar: `/`, `/projeler/[slug]`, `/labs`, `/uyelik`

## 7) Security Baseline

- `vercel.json` başlıklarının aktif olduğunu doğrulayın.
- API route'larında başarısız webhook imzalarının 401 döndürdüğünü test edin.

## 8) Yayın Sonrası Smoke Test

- Ana sayfa kartları CMS verisi çekiyor mu?
- VeriBot cevap üretiyor mu?
- Premium içerik üyelik olmadan kilitli mi?
- Checkout yönlendirmesi çalışıyor mu?
- Webhook sonrası unlock akışı çalışıyor mu?

