# Content Lifecycle Policy (Digital Garden v2)

## Purpose

This policy defines how Digital Garden content moves across maturity levels and how backlink density contributes to lifecycle decisions.

## Maturity Stages

1. **Seed**
   - Early idea or raw note
   - Minimal structure, exploratory language

2. **Growing**
   - Expanded explanation and clearer examples
   - At least one meaningful internal relation

3. **Evergreen**
   - Stable, reusable reference content
   - Strong internal linkage and periodic maintenance

## Promotion Signals

### Seed -> Growing
- At least one revision after initial publish
- Backlink count >= 1
- Includes practical takeaway or implementation detail

### Growing -> Evergreen
- Backlink count >= 3
- Updated within last 120 days or explicitly reviewed
- Contains clear scope, constraints, and references

## Demotion Signals

- Outdated technical details without revision for > 365 days
- Broken references or invalid outbound links
- Contradicting newer canonical content

## Operational Rules

1. Obsidian sync extracts outbound links and computes backlinks.
2. Graph view visualizes maturity + recency + topic filters.
3. Editorial review runs weekly for promoted/demoted candidates.

## Ownership

- Primary owner: Content/Platform maintainer
- Review cadence: Weekly batch
- Emergency correction SLA: 48 hours

