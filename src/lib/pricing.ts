import type { CatalogProduct, ProductBadge } from '../types/catalog'

export const BADGE_OPTIONS: { value: ProductBadge; label: string }[] = [
  { value: '', label: 'Sin etiqueta' },
  { value: 'destacado', label: 'Destacado' },
  { value: 'por-agotar', label: 'Por agotar' },
  { value: 'promocion', label: 'Promoción' },
  { value: 'descuento', label: 'Descuento' },
]

export const BADGE_LABELS: Record<Exclude<ProductBadge, ''>, string> = {
  destacado: 'Destacado',
  'por-agotar': 'Por agotar',
  promocion: 'Promoción',
  descuento: 'Descuento',
}

export function parsePrice(price: string): number {
  return Number(String(price).replace(/[^\d]/g, '')) || 0
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString('es-AR')}`
}

export function normalizeDiscount(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return 0
  return Math.min(100, Math.round(n))
}

export function discountedAmount(price: string, discountPercent?: number): number {
  const original = parsePrice(price)
  const percent = normalizeDiscount(discountPercent)
  if (!original || !percent) return original
  return Math.round(original * (1 - percent / 100))
}

export function productPricing(product: Pick<CatalogProduct, 'price' | 'discountPercent'>) {
  const percent = normalizeDiscount(product.discountPercent)
  const original = parsePrice(product.price)
  const final = discountedAmount(product.price, percent)
  return {
    percent,
    original,
    final,
    hasDiscount: percent > 0 && original > 0 && final < original,
    originalLabel: product.price || formatPrice(original),
    finalLabel: formatPrice(final),
  }
}
