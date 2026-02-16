// @ts-nocheck

function normalizeSeries(metric: any) {
  if (Array.isArray(metric?.trendPoints) && metric.trendPoints.length > 1) {
    return metric.trendPoints
      .map((point: any) => ({
        label: point?.label || point?.period || '-',
        value: Number(point?.value ?? 0),
      }))
      .filter((point: any) => Number.isFinite(point.value))
  }

  const baseline = Number(metric?.baselineValue ?? 0)
  const result = Number(metric?.resultValue ?? baseline)

  return [
    { label: 'Önce', value: baseline },
    { label: 'Sonra', value: result },
  ]
}

export default function KpiTrendChart({ metric }: { metric: any }) {
  const series = normalizeSeries(metric)

  const min = Math.min(...series.map((s: any) => s.value))
  const max = Math.max(...series.map((s: any) => s.value))
  const range = Math.max(max - min, 1)

  const points = series
    .map((item: any, index: number) => {
      const x = series.length === 1 ? 10 : (index / (series.length - 1)) * 100
      const y = 100 - ((item.value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="kpi-trend" aria-label={`${metric?.metricLabel || 'KPI'} trend grafiği`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img">
        <polyline className="kpi-trend-line" points={points} />
        {series.map((item: any, index: number) => {
          const x = series.length === 1 ? 10 : (index / (series.length - 1)) * 100
          const y = 100 - ((item.value - min) / range) * 100

          return <circle key={`${item.label}-${index}`} cx={x} cy={y} r="2.3" className="kpi-trend-dot" />
        })}
      </svg>

      <div className="kpi-trend-legend">
        {series.map((item: any, index: number) => (
          <div key={`${item.label}-${index}`} className="kpi-trend-item">
            <small>{item.label}</small>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

