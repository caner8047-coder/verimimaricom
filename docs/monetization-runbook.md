# Monetization Reliability Runbook (V1.3 Sprint 5)

## Scope

This runbook covers:

1. Membership entitlement persistence
2. Webhook idempotency handling
3. Secure asset download token flow

## Components

- Entitlement store: [`entitlements.ts`](zolm-main/brand-site/next/src/lib/entitlements.ts)
- Webhook processor: [`webhook route`](zolm-main/brand-site/next/src/app/api/commerce/webhook/route.ts)
- Membership unlock: [`unlock route`](zolm-main/brand-site/next/src/app/api/membership/unlock/route.ts)
- Secure download endpoint: [`assets/download route`](zolm-main/brand-site/next/src/app/api/assets/download/route.ts)

## Entitlement Persistence

- Storage file: `data/entitlements/members.json`
- Maintains:
  - `activeMembers`
  - `processedWebhookEvents`

Operational note:
- Current storage is file-backed for reliability improvements over in-memory mode.
- Production target remains DB-backed persistence.

## Webhook Idempotency

- Incoming event is identified via `event_id` fallback chain.
- If event already processed, endpoint returns `{ ok: true, duplicate: true }`.
- Duplicate events do not re-grant membership.

## Secure Asset Token Flow

### Issue phase
- Endpoint: `GET /api/assets/download?mode=issue&email=...&asset=...`
- Validates membership before issuing token.

### Consume phase
- Endpoint: `GET /api/assets/download?mode=consume&token=...`
- Verifies signature and expiry.
- Returns demo response; production should redirect to object storage presigned URL.

## Failure Modes

1. Invalid webhook signature -> 401
2. Duplicate webhook event -> safe no-op response
3. Unlock without membership -> 403
4. Invalid/expired asset token -> 401

## Production Upgrade Checklist

- [ ] Move entitlements and processed events to PostgreSQL
- [ ] Add webhook retry queue with dead-letter strategy
- [ ] Replace demo asset consume response with S3/R2 redirect
- [ ] Add audit log stream for membership grants and token issue events

