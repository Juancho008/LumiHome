export const STATS_KEY = 'stats'

export type SiteStats = {
  visits: number
  pageViews: number
  productClicks: number
  byProduct: Record<string, number>
  updatedAt: number
}

export type StatsEventType = 'visit' | 'page_view' | 'product_click'

export function emptyStats(): SiteStats {
  return { visits: 0, pageViews: 0, productClicks: 0, byProduct: {}, updatedAt: Date.now() }
}

export function normalizeStats(raw: unknown): SiteStats {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Partial<SiteStats>
  const byProduct =
    data.byProduct && typeof data.byProduct === 'object' && !Array.isArray(data.byProduct)
      ? Object.fromEntries(
          Object.entries(data.byProduct).filter(
            ([k, v]) => typeof k === 'string' && typeof v === 'number' && Number.isFinite(v),
          ),
        )
      : {}
  return {
    visits: typeof data.visits === 'number' && data.visits >= 0 ? data.visits : 0,
    pageViews: typeof data.pageViews === 'number' && data.pageViews >= 0 ? data.pageViews : 0,
    productClicks:
      typeof data.productClicks === 'number' && data.productClicks >= 0 ? data.productClicks : 0,
    byProduct,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  }
}

export function applyEvent(
  stats: SiteStats,
  event: { type: StatsEventType; productId?: string },
): SiteStats {
  const next: SiteStats = {
    ...stats,
    byProduct: { ...stats.byProduct },
    updatedAt: Date.now(),
  }
  if (event.type === 'visit') {
    next.visits += 1
  } else if (event.type === 'page_view') {
    next.pageViews += 1
  } else if (event.type === 'product_click' && event.productId) {
    next.productClicks += 1
    next.byProduct[event.productId] = (next.byProduct[event.productId] || 0) + 1
  }
  return next
}

export function isValidEvent(body: unknown): body is { type: StatsEventType; productId?: string } {
  if (!body || typeof body !== 'object') return false
  const { type, productId } = body as { type?: unknown; productId?: unknown }
  if (type === 'visit' || type === 'page_view') return true
  if (type === 'product_click') return typeof productId === 'string' && productId.trim().length > 0
  return false
}
