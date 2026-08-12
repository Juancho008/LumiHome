import { BADGE_LABELS, productPricing } from '../lib/pricing'
import type { CatalogProduct } from '../types/catalog'

export function ProductBadges({ product }: { product: CatalogProduct }) {
  const pricing = productPricing(product)
  const chips: { key: string; label: string; tone: 'ink' | 'gold' }[] = []

  if (product.badge && product.badge !== 'descuento') {
    chips.push({ key: product.badge, label: BADGE_LABELS[product.badge], tone: 'ink' })
  }

  if (pricing.hasDiscount) {
    chips.push({ key: 'off', label: `${pricing.percent}% OFF`, tone: 'gold' })
  } else if (product.badge === 'descuento') {
    chips.push({ key: 'descuento', label: 'Descuento', tone: 'gold' })
  }

  if (chips.length === 0) return null

  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            chip.tone === 'gold' ? 'bg-gold text-ink' : 'bg-ink text-cream'
          }`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  )
}

export function ProductPrice({
  product,
  className = '',
}: {
  product: CatalogProduct
  className?: string
}) {
  const pricing = productPricing(product)

  if (!pricing.hasDiscount) {
    return <p className={`text-[12px] font-medium tracking-[0.04em] text-muted ${className}`}>{product.price}</p>
  }

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span className="text-[13px] font-semibold tracking-[0.04em] text-ink">{pricing.finalLabel}</span>
      <span className="text-[12px] font-medium tracking-[0.04em] text-muted line-through">
        {pricing.originalLabel}
      </span>
    </p>
  )
}
