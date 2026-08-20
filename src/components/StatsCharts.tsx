export type BarChartItem = {
  label: string
  value: number
  sublabel?: string
  color?: string
}

type StatsBarChartProps = {
  title: string
  items: BarChartItem[]
  emptyMessage?: string
}

export function StatsBarChart({ title, items, emptyMessage }: StatsBarChartProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value)
  const max = sorted[0]?.value ?? 0

  return (
    <div className="border border-line bg-white/30 p-5 md:p-6">
      <h3 className="font-serif text-xl tracking-[0.06em] text-ink">{title}</h3>
      {sorted.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted">
          {emptyMessage ?? 'Todavía no hay datos para mostrar.'}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {sorted.map((item) => {
            const width = max > 0 ? Math.max((item.value / max) * 100, 4) : 0
            return (
              <div key={`${item.label}-${item.sublabel ?? ''}`}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{item.label}</p>
                    {item.sublabel ? (
                      <p className="truncate text-[11px] text-muted">{item.sublabel}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink">
                    {item.value.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden bg-[#efece6]">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${width}%`,
                      backgroundColor: item.color ?? '#111111',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type StatsDonutProps = {
  title: string
  segments: { label: string; value: number; color: string }[]
}

export function StatsDonut({ title, segments }: StatsDonutProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) {
    return (
      <div className="border border-line bg-white/30 p-5 md:p-6">
        <h3 className="font-serif text-xl tracking-[0.06em] text-ink">{title}</h3>
        <p className="mt-4 text-[13px] text-muted">Todavía no hay datos para mostrar.</p>
      </div>
    )
  }

  let cumulative = 0
  const gradientStops = segments
    .map((segment) => {
      const start = (cumulative / total) * 100
      cumulative += segment.value
      const end = (cumulative / total) * 100
      return `${segment.color} ${start}% ${end}%`
    })
    .join(', ')

  return (
    <div className="border border-line bg-white/30 p-5 md:p-6">
      <h3 className="font-serif text-xl tracking-[0.06em] text-ink">{title}</h3>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div
          className="relative h-36 w-36 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${gradientStops})` }}
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-cream text-center">
            <span className="font-serif text-2xl tabular-nums text-ink">
              {total.toLocaleString('es-AR')}
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">Total</span>
          </div>
        </div>
        <div className="w-full space-y-2.5">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate text-[12px] text-ink">{segment.label}</span>
              </div>
              <span className="shrink-0 text-[12px] font-medium tabular-nums text-ink">
                {segment.value.toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
