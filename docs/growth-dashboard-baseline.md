# Growth Dashboard Baseline (V1.1)

## Amaç

CTA, VeriBot ve Membership funnel performansını haftalık takip etmek için minimum metrik seti.

## Dashboard Bölümleri

## 1) Home CTA Performansı

- KPI: Toplam CTA tıklaması
- KPI: Hero CTA CTR
- KPI: Persona Path tıklama dağılımı

Kaynak eventler:
- `cta_home_*`
- `persona_*_path_click`

## 2) Komuta Merkezi Kullanımı

- KPI: `command_palette_open` sayısı
- KPI: Open -> Select dönüşüm oranı
- KPI: En çok seçilen komutlar (`command_id`)

Kaynak eventler:
- `command_palette_open`
- `command_palette_select`
- `command_palette_close`

## 3) VeriBot Etkileşimi

- KPI: `veribot_open` sayısı
- KPI: `veribot_submit` sayısı
- KPI: Ortalama prompt uzunluğu

Kaynak eventler:
- `veribot_open`
- `veribot_submit`

## 4) Membership Funnel

- KPI: Checkout start
- KPI: Unlock success
- KPI: Unlock fail
- KPI: Success ratio = success / (success + fail)

Kaynak eventler:
- `membership_checkout_start`
- `membership_unlock_success`
- `membership_unlock_failed`

## Haftalık Rapor Formatı

- Dönem: (YYYY-WW)
- Top 3 artan metrik
- Top 3 düşen metrik
- Aksiyonlar (next week)

## Minimum Hedefler

- Hero CTA CTR >= %4
- Command Palette Open->Select >= %40
- VeriBot submit/open >= %30
- Membership unlock success ratio >= %70
