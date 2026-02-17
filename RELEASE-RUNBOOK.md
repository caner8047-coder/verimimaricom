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

## 8.1) Quality Scorecard (Release Approval)

Release öncesi kalite puanı tabloya göre hesaplanır.

| Alan | Kontrol | Puan |
|---|---|---|
| Build | `npm run build` başarılı | 25 |
| Smoke | `npm run smoke:test` başarılı | 25 |
| Analytics QA | Kritik eventler doğrulandı | 15 |
| Membership | checkout + unlock happy path geçti | 15 |
| VeriBot | açılış + submit + action hint akışı geçti | 10 |
| i18n | TR/EN ana akış link kontrolü geçti | 10 |

Toplam: **100**

Release threshold:
- **>= 85**: Yayına çıkabilir
- **70-84**: Risk kabulü ile sınırlı yayın (gerekçe zorunlu)
- **< 70**: Yayın bloklanır

## 8.2) Preview/Canary Gate

- PR aşamasında preview/canary job çalışır.
- Preview smoke başarısız ise merge bloklanır.
- Referans gate: `preview-canary-check` job.

## 9) Incident Template

- Şablon: [`docs/incident-report-template.md`](docs/incident-report-template.md)

## 10) Rollback Trigger Matrix

| Durum | Seviyesi | Aksiyon |
|---|---|---|
| Ana rota erişilemiyor (`/`) | Sev-1 | Anında rollback + incident aç |
| Ödeme webhook 5xx oranı yüksek | Sev-1 | Rollback + webhook queue incele |
| Membership unlock başarısı < %50 | Sev-2 | Hotfix veya rollback kararı 15 dk içinde |
| VeriBot tamamen yanıt veremiyor | Sev-2 | Model/env rollback, gerekirse full rollback |
| Sadece görsel regression | Sev-3 | Hotfix ile düzelt, rollback zorunlu değil |

Karar SLA:
- Sev-1: **5 dakika** içinde rollback kararı
- Sev-2: **15 dakika** içinde rollback/hotfix kararı
- Sev-3: Sonraki patch release'e alınabilir
