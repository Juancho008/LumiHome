export const STATS_KEY = 'stats'

export type StatsEventType = 'visit' | 'page_view' | 'product_click' | 'color_select' | 'add_to_cart'

export type StatsEvent = {
  type: StatsEventType
  productId?: string
  color?: string
}

export type SiteStats = {
  visits: number
  pageViews: number
  productClicks: number
  colorSelections: number
  addToCart: number
  byProduct: Record<string, number>
  byColorSelect: Record<string, number>
  byAddToCart: Record<string, number>
  updatedAt: number
}

export function productColorKey(productId: string, color: string): string {
  return `${productId}::${color}`
}

export function emptyStats(): SiteStats {
  return {
    visits: 0,
    pageViews: 0,
    productClicks: 0,
    colorSelections: 0,
    addToCart: 0,
    byProduct: {},
    byColorSelect: {},
    byAddToCart: {},
    updatedAt: Date.now(),
  }
}

function normalizeCountMap(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return Object.fromEntries(
    Object.entries(raw).filter(
      ([k, v]) => typeof k === 'string' && typeof v === 'number' && Number.isFinite(v) && v >= 0,
    ),
  )
}

export function normalizeStats(raw: unknown): SiteStats {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Partial<SiteStats>
  return {
    visits: typeof data.visits === 'number' && data.visits >= 0 ? data.visits : 0,
    pageViews: typeof data.pageViews === 'number' && data.pageViews >= 0 ? data.pageViews : 0,
    productClicks:
      typeof data.productClicks === 'number' && data.productClicks >= 0 ? data.productClicks : 0,
    colorSelections:
      typeof data.colorSelections === 'number' && data.colorSelections >= 0 ? data.colorSelections : 0,
    addToCart: typeof data.addToCart === 'number' && data.addToCart >= 0 ? data.addToCart : 0,
    byProduct: normalizeCountMap(data.byProduct),
    byColorSelect: normalizeCountMap(data.byColorSelect),
    byAddToCart: normalizeCountMap(data.byAddToCart),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  }
}

export function applyEvent(stats: SiteStats, event: StatsEvent): SiteStats {
  const next: SiteStats = {
    ...stats,
    byProduct: { ...stats.byProduct },
    byColorSelect: { ...stats.byColorSelect },
    byAddToCart: { ...stats.byAddToCart },
    updatedAt: Date.now(),
  }

  if (event.type === 'visit') {
    next.visits += 1
  } else if (event.type === 'page_view') {
    next.pageViews += 1
  } else if (event.type === 'product_click' && event.productId) {
    next.productClicks += 1
    next.byProduct[event.productId] = (next.byProduct[event.productId] || 0) + 1
  } else if (event.type === 'color_select' && event.productId && event.color) {
    const key = productColorKey(event.productId, event.color)
    next.colorSelections += 1
    next.byColorSelect[key] = (next.byColorSelect[key] || 0) + 1
  } else if (event.type === 'add_to_cart' && event.productId && event.color) {
    const key = productColorKey(event.productId, event.color)
    next.addToCart += 1
    next.byAddToCart[key] = (next.byAddToCart[key] || 0) + 1
  }

  return next
}

export function isValidEvent(body: unknown): body is StatsEvent {
  if (!body || typeof body !== 'object') return false
  const { type, productId, color } = body as StatsEvent
  if (type === 'visit' || type === 'page_view') return true
  if (type === 'product_click') return typeof productId === 'string' && productId.trim().length > 0
  if (type === 'color_select' || type === 'add_to_cart') {
    return (
      typeof productId === 'string' &&
      productId.trim().length > 0 &&
      typeof color === 'string' &&
      color.trim().length > 0
    )
  }
  return false
}
