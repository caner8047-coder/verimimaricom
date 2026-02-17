# i18n Quality Checklist (TR/EN)

## Navigation & Routing

- [ ] TR main route (`/`) links point to TR targets
- [ ] EN main route (`/en`) links point to EN targets where available
- [ ] Command palette anchors resolve correctly on both TR and EN routes
- [ ] Language switch controls show correct active locale state

## Content Parity

- [ ] Hero copy exists for both TR and EN
- [ ] Persona quick paths exist for both TR and EN
- [ ] Bento labels/CTA text exist for both TR and EN
- [ ] Membership and Labs pages available in both locales

## Assistant Language Behavior

- [ ] VeriBot uses route/header locale fallback correctly
- [ ] Turkish route defaults to Turkish response mode
- [ ] English route defaults to English response mode
- [ ] Explicit user language override still works

## SEO & Metadata

- [ ] `alternates.languages` maps TR and EN correctly
- [ ] Canonical paths do not conflict between locales
- [ ] OG/title descriptions remain meaningful across locales

## Regression Safety

- [ ] `npm run build` passes after i18n changes
- [ ] No broken internal links in primary journeys
- [ ] Key CTA tracking events still fire

