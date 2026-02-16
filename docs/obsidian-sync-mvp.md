# Obsidian Sync MVP

Bu doküman [`obsidian-sync.mjs`](zolm-main/brand-site/next/scripts/obsidian-sync.mjs) kullanımını açıklar.

## Amaç

Obsidian vault içindeki `#public` etiketli notları tarayıp JSON çıktısı üretmek.

Çıktı dosyası varsayılanı:
- `./data/obsidian-sync/public-notes.json`

## Ortam Değişkenleri

- `OBSIDIAN_VAULT_PATH` (zorunlu)
- `OBSIDIAN_SYNC_OUTPUT` (opsiyonel, varsayılan: `./data/obsidian-sync`)

## Not Formatı

Önerilen frontmatter:

```md
---
title: Örnek Not
slug: ornek-not
maturity: growing
excerpt: Kısa özet
tags: #public #ai
---

Not içeriği...
```

## Çalıştırma

Windows (PowerShell):

```powershell
$env:OBSIDIAN_VAULT_PATH="C:\path\to\vault"
node ./scripts/obsidian-sync.mjs
```

## Maturity Değerleri

- `seed`
- `growing`
- `evergreen`

Tanımsız veya geçersiz değerler `seed` olarak normalize edilir.
