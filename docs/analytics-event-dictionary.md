# Analytics Event Dictionary (V1.1)

## Naming Convention

Format:

`<domain>_<area>_<action>_<result?>`

Örnek:
- `cta_home_featured_cases_click`
- `veribot_submit`
- `membership_unlock_success`

## Event Ownership

- Product/Growth Owner: Caner Ünal
- Technical Owner: Frontend + API katmanı
- Review Cycle: Haftalık (Pazartesi)

## Event Listesi

## Home / CTA
- `cta_home_featured_cases_click`
  - payload: `placement`, `cta`, `href`
- `cta_home_premium_click`
  - payload: `placement`, `cta`, `href`
- `cta_home_cases_all_click`
  - payload: `placement`, `section`, `href`
- `cta_home_blog_discover_click`
  - payload: `placement`, `section`, `href`
- `cta_home_labs_click`
  - payload: `placement`, `section`, `href`
- `cta_home_contact_click`
  - payload: `placement`, `section`, `href`

## Persona Paths
- `persona_recruiter_path_click`
  - payload: `placement`, `href`
- `persona_business_path_click`
  - payload: `placement`, `href`
- `persona_builder_path_click`
  - payload: `placement`, `href`

## Command Palette
- `command_palette_open`
  - payload: `source`
- `command_palette_close`
  - payload: `source`
- `command_palette_open_click`
  - payload: `source`
- `command_palette_select`
  - payload: `command_id`, `href`, `source`

## VeriBot
- `veribot_open`
  - payload: `source`
- `veribot_close`
  - payload: `source`
- `veribot_submit`
  - payload: `prompt_length`

## Membership
- `membership_checkout_start`
  - payload: `placement`, `has_email`, `email_domain`
- `membership_unlock_success`
  - payload: `placement`, `email_domain`
- `membership_unlock_failed`
  - payload: `placement`, `email_domain`

## QA Rules

- Her event adı snake_case olmalı.
- PII göndermeyin (tam e-posta yok, sadece domain gibi türetilmiş değerler).
- `undefined` payload alanları otomatik temizlenmeli.
