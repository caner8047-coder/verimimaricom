// @ts-nocheck
import crypto from 'node:crypto'

function s3Config() {
  const endpoint = process.env.S3_ENDPOINT || ''
  const region = process.env.S3_REGION || 'us-east-1'
  const bucket = process.env.S3_BUCKET || ''
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || ''
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || ''

  return {
    endpoint,
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
  }
}

function hmac(key: any, value: string) {
  return crypto.createHmac('sha256', key).update(value).digest()
}

function hashHex(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function deriveSigningKey(secretAccessKey: string, dateStamp: string, region: string) {
  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp)
  const kRegion = hmac(kDate, region)
  const kService = hmac(kRegion, 's3')
  return hmac(kService, 'aws4_request')
}

function toAmzDate(date = new Date()) {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, '')
  return {
    amzDate: iso,
    dateStamp: iso.slice(0, 8),
  }
}

export function hasS3Config() {
  const cfg = s3Config()
  return Boolean(cfg.endpoint && cfg.bucket && cfg.accessKeyId && cfg.secretAccessKey)
}

export function createS3PresignedGetUrl(key: string, expiresSeconds = 900) {
  const cfg = s3Config()
  if (!hasS3Config()) {
    return null
  }

  const cleanKey = String(key || '').replace(/^\/+/, '')
  const endpoint = String(cfg.endpoint).replace(/\/+$/, '')
  const host = new URL(endpoint).host

  const { amzDate, dateStamp } = toAmzDate(new Date())
  const credentialScope = `${dateStamp}/${cfg.region}/s3/aws4_request`

  const algorithm = 'AWS4-HMAC-SHA256'
  const canonicalUri = `/${cfg.bucket}/${encodeURI(cleanKey)}`
  const canonicalQuery = new URLSearchParams({
    'X-Amz-Algorithm': algorithm,
    'X-Amz-Credential': `${cfg.accessKeyId}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresSeconds),
    'X-Amz-SignedHeaders': 'host',
  })

  const canonicalRequest = [
    'GET',
    canonicalUri,
    canonicalQuery.toString(),
    `host:${host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n')

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    hashHex(canonicalRequest),
  ].join('\n')

  const signingKey = deriveSigningKey(cfg.secretAccessKey, dateStamp, cfg.region)
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex')

  canonicalQuery.set('X-Amz-Signature', signature)

  return `${endpoint}${canonicalUri}?${canonicalQuery.toString()}`
}

