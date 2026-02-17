import fs from 'node:fs/promises'
import path from 'node:path'

const EVENT_FILE = process.env.ANALYTICS_EVENTS_FILE || './data/analytics/events.json'

async function readEvents() {
  try {
    const file = path.resolve(EVENT_FILE)
    const raw = await fs.readFile(file, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function count(events, regex) {
  return events.filter((e) => regex.test(String(e?.name || ''))).length
}

function safeRatio(numerator, denominator) {
  if (!denominator) return 0
  return Number(((numerator / denominator) * 100).toFixed(2))
}

async function main() {
  const events = await readEvents()

  const ctaClicks = count(events, /^cta_home_/)
  const personaClicks = count(events, /^persona_.*_path_click$/)

  const cmdOpen = count(events, /^command_palette_open$/)
  const cmdSelect = count(events, /^command_palette_select$/)

  const botOpen = count(events, /^veribot_open$/)
  const botSubmit = count(events, /^veribot_submit$/)

  const membershipStart = count(events, /^membership_checkout_start$/)
  const unlockSuccess = count(events, /^membership_unlock_success$/)
  const unlockFail = count(events, /^membership_unlock_failed$/)

  const report = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.resolve(EVENT_FILE),
    totals: {
      events: events.length,
      ctaClicks,
      personaClicks,
      commandPaletteOpen: cmdOpen,
      commandPaletteSelect: cmdSelect,
      veribotOpen: botOpen,
      veribotSubmit: botSubmit,
      membershipCheckoutStart: membershipStart,
      membershipUnlockSuccess: unlockSuccess,
      membershipUnlockFail: unlockFail,
    },
    kpis: {
      commandPaletteOpenToSelectPct: safeRatio(cmdSelect, cmdOpen),
      veribotSubmitToOpenPct: safeRatio(botSubmit, botOpen),
      membershipUnlockSuccessPct: safeRatio(unlockSuccess, unlockSuccess + unlockFail),
    },
    note: 'If totals are zero, provide analytics export to data/analytics/events.json or set ANALYTICS_EVENTS_FILE.',
  }

  const outputDir = path.resolve('./data/growth')
  await fs.mkdir(outputDir, { recursive: true })

  const outputPath = path.join(outputDir, `weekly-report-${new Date().toISOString().slice(0, 10)}.json`)
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf-8')

  console.log(JSON.stringify({ ok: true, outputPath, ...report.kpis }, null, 2))
}

main().catch((error) => {
  console.error('[growth-weekly-report] failed:', error)
  process.exit(1)
})

