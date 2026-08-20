import type { StatsEventType } from '../types/stats'

const VISIT_KEY = 'lumi-visit-tracked'

export function track(type: StatsEventType, data?: { productId?: string }) {
  void fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...data }),
    keepalive: true,
  }).catch(() => {})
}

export function trackPageVisit() {
  if (!sessionStorage.getItem(VISIT_KEY)) {
    track('visit')
    sessionStorage.setItem(VISIT_KEY, '1')
  }
  track('page_view')
}

export function trackProductClick(productId: string) {
  track('product_click', { productId })
}
