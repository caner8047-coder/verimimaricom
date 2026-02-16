# Veri Mimarı — Release Runbook v1

## 1) Amaç

Canlı ortama çıkış öncesinde kalite, güvenlik ve geri dönüş adımlarını standartlaştırmak.

---

## 2) Release Öncesi Zorunlu Checklist

- [ ] `main` branch güncel ve korumalı
- [ ] Yerel build başarılı: `npm run build`
- [ ] Smoke test başarılı: `npm run smoke:test`
- [ ] Kritik env değişkenleri Vercel'de doğrulandı
- [ ] Son commit mesajı release kapsamını net anlatıyor
- [ ] Rollback adımı hazır

---

## 3) Yayın Akışı

1. `main` branch'e merge/push yapın
2. Vercel deployment loglarını izleyin
3. Deploy başarılıysa canlı smoke test çalıştırın
4. KPI kontrolü yapın (CTA, VeriBot, membership akışı)

---

## 4) Incident Seviyeleri

## Sev-1 (Kritik)
- Ana sayfa erişilemiyor
- API'ler sistematik 5xx dönüyor
- Ödeme/membership akışı tamamen bozuk

## Sev-2 (Yüksek)
- VeriBot intermittently hata veriyor
- Kritik olmayan sayfalarda render bozulması

## Sev-3 (Orta)
- UI regressions, düşük öncelikli fonksiyonel kusurlar

---

## 5) Rollback Prosedürü

1. Son stabil commit hash tespit edilir
2. `git revert <problematic_commit>` ile geri alma commit'i hazırlanır
3. `main` branch'e push edilir
4. Vercel yeni deployment tamamlanınca smoke test tekrarlanır
5. Incident notu ve root-cause raporu eklenir

---

## 6) Yayın Sonrası 15 Dakika Kontrol

- [ ] `/` açılıyor
- [ ] `/labs` açılıyor
- [ ] `/uyelik` açılıyor
- [ ] `/robots.txt` ve `/sitemap.xml` erişilebilir
- [ ] VeriBot paneli açılıyor ve submit akışı tetikleniyor
- [ ] Membership checkout başlangıç akışı çalışıyor

## 6.1) Analytics QA Kontrolü (Yeni)

- [ ] Home CTA eventleri geliyor mu? (`cta_home_*`)
- [ ] Persona path eventleri geliyor mu? (`persona_*_path_click`)
- [ ] Command palette eventleri geliyor mu? (`command_palette_*`)
- [ ] VeriBot eventleri geliyor mu? (`veribot_open`, `veribot_submit`)
- [ ] Membership eventleri geliyor mu? (`membership_checkout_start`, `membership_unlock_*`)

Referans: [`docs/analytics-event-dictionary.md`](docs/analytics-event-dictionary.md)

---

## 7) Operasyonel Not

Smoke test URL'i varsayılan olarak `https://verimimari.com` kullanır. Gerekirse:

`SMOKE_BASE_URL=https://<preview-domain> npm run smoke:test`

## 8) CI Quality Gate Referansı

- Workflow: [`.github/workflows/quality-gates.yml`](.github/workflows/quality-gates.yml)
- Gate adımları: `npm ci` -> `npm run build` -> `npm run smoke:test`

## 9) Incident Template

- Şablon: [`docs/incident-report-template.md`](docs/incident-report-template.md)
