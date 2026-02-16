const baseUrl = (process.env.SMOKE_BASE_URL || 'https://verimimari.com').replace(/\/$/, '')

const checks = [
  { name: 'Home', path: '/', expectedStatus: 200 },
  { name: 'Labs', path: '/labs', expectedStatus: 200 },
  { name: 'Membership', path: '/uyelik', expectedStatus: 200 },
  { name: 'Robots', path: '/robots.txt', expectedStatus: 200 },
  { name: 'Sitemap', path: '/sitemap.xml', expectedStatus: 200 },
  { name: 'VeriBot API (method check)', path: '/api/veribot', expectedStatus: 405 },
  { name: 'Membership unlock API (method check)', path: '/api/membership/unlock', expectedStatus: 405 },
]

async function runCheck(check) {
  const url = `${baseUrl}${check.path}`

  try {
    const res = await fetch(url, { method: 'GET' })
    const ok = res.status === check.expectedStatus

    return {
      ...check,
      url,
      status: res.status,
      ok,
      message: ok
        ? `OK (${res.status})`
        : `Expected ${check.expectedStatus} but received ${res.status}`,
    }
  } catch (error) {
    return {
      ...check,
      url,
      status: 0,
      ok: false,
      message: `Request failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

async function main() {
  console.log(`Running smoke checks against: ${baseUrl}`)

  const results = []
  for (const check of checks) {
    const result = await runCheck(check)
    results.push(result)
    const icon = result.ok ? '✅' : '❌'
    console.log(`${icon} ${result.name} -> ${result.url} :: ${result.message}`)
  }

  const failed = results.filter((r) => !r.ok)
  if (failed.length > 0) {
    console.error(`\nSmoke test failed: ${failed.length}/${results.length} checks failed.`)
    process.exit(1)
  }

  console.log(`\nSmoke test passed: ${results.length}/${results.length} checks succeeded.`)
}

main().catch((err) => {
  console.error('Smoke test crashed:', err)
  process.exit(1)
})

