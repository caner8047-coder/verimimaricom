// @ts-nocheck

function formatValue(value: number | null | undefined, unit?: string) {
  if (value === null || value === undefined) return '-'
  return `${value}${unit ? ` ${unit}` : ''}`
}

function safePercent(baseline: number | null | undefined, result: number | null | undefined) {
  if (baseline === null || baseline === undefined || baseline === 0 || result === null || result === undefined) {
    return 0
  }
  return ((result - baseline) / Math.abs(baseline)) * 100
}

function clampBar(deltaPercent: number) {
  const normalized = Math.min(100, Math.max(5, Math.abs(deltaPercent)))
  return normalized
}

export default function MetricsBoard({ metrics = [] }) {
  return (
    <section className="case-block glass" aria-label="Case study metrics visualization">
      <h2>Metrik Görselleştirmesi</h2>
      <p>Öncesi ve sonrası değerleri karşılaştırmalı olarak veri hikayeciliği yaklaşımıyla sunulur.</p>

      <div className="metrics-grid">
        {metrics.map((metric: any, index: number) => {
          const delta = safePercent(metric.baselineValue, metric.resultValue)
          const barWidth = clampBar(delta)
          const isUp = delta >= 0

          return (
            <article key={`${metric.metricKey || 'metric'}-${index}`} className="metric-row">
              <div className="metric-head">
                <strong>{metric.metricLabel || metric.metricKey || 'Metric'}</strong>
                <small>{metric.periodLabel || 'Dönem belirtilmedi'}</small>
              </div>

              <div className="metric-values">
                <span>
                  Baseline: {formatValue(metric.baselineValue, metric.unit)} · Result:{' '}
                  {formatValue(metric.resultValue, metric.unit)}
                </span>
                <span className={`delta ${isUp ? 'up' : 'down'}`}>
                  {isUp ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
                </span>
              </div>

              <div className="metric-bar" aria-hidden="true">
                <span style={{ width: `${barWidth}%` }} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

