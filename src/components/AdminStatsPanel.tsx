import { BarChart3, Eye, MousePointerClick, Palette, ShoppingBag, Users } from 'lucide-react'
import type { CatalogProduct } from '../types/catalog'
import type { SiteStats } from '../types/stats'
import { StatsBarChart, StatsDonut } from './StatsCharts'

type AdminStatsPanelProps = {
  stats: SiteStats
  products: CatalogProduct[]
}

function parseProductColorKey(key: string): { productId: string; color: string } {
  const sep = key.indexOf('::')
  if (sep < 0) return { productId: key, color: '' }
  return { productId: key.slice(0, sep), color: key.slice(sep + 2) }
}

function resolveProductName(products: CatalogProduct[], productId: string): string {
  return products.find((p) => p.id === productId)?.name ?? productId
}

function resolveColorHex(products: CatalogProduct[], productId: string, color: string): string {
  const product = products.find((p) => p.id === productId)
  return product?.colors.find((c) => c.name === color)?.hex ?? '#111111'
}

export function AdminStatsPanel({ stats, products }: AdminStatsPanelProps) {
  const productClickItems = Object.entries(stats.byProduct)
    .sort(([, a], [, b]) => b - a)
    .map(([productId, value]) => ({
      label: resolveProductName(products, productId),
      sublabel: productId,
      value,
      color: '#111111',
    }))

  const colorSelectItems = Object.entries(stats.byColorSelect)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => {
      const { productId, color } = parseProductColorKey(key)
      return {
        label: resolveProductName(products, productId),
        sublabel: color,
        value,
        color: resolveColorHex(products, productId, color),
      }
    })

  const addToCartItems = Object.entries(stats.byAddToCart)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => {
      const { productId, color } = parseProductColorKey(key)
      return {
        label: resolveProductName(products, productId),
        sublabel: color,
        value,
        color: resolveColorHex(products, productId, color),
      }
    })

  const detailRows = (() => {
    const keys = new Set([
      ...Object.keys(stats.byProduct),
      ...Object.keys(stats.byColorSelect),
      ...Object.keys(stats.byAddToCart),
    ])

    const rows: {
      key: string
      productId: string
      color: string
      clicks: number
      colorSelections: number
      addToCart: number
    }[] = []

    for (const productId of keys) {
      if (productId.includes('::')) continue
      rows.push({
        key: productId,
        productId,
        color: '—',
        clicks: stats.byProduct[productId] ?? 0,
        colorSelections: 0,
        addToCart: 0,
      })
    }

    const colorKeys = new Set([
      ...Object.keys(stats.byColorSelect),
      ...Object.keys(stats.byAddToCart),
    ])

    for (const key of colorKeys) {
      const { productId, color } = parseProductColorKey(key)
      rows.push({
        key,
        productId,
        color,
        clicks: 0,
        colorSelections: stats.byColorSelect[key] ?? 0,
        addToCart: stats.byAddToCart[key] ?? 0,
      })
    }

    return rows
      .filter((row) => row.clicks > 0 || row.colorSelections > 0 || row.addToCart > 0)
      .sort(
        (a, b) =>
          b.clicks + b.colorSelections + b.addToCart - (a.clicks + a.colorSelections + a.addToCart),
      )
  })()

  const hasProductData =
    productClickItems.length > 0 || colorSelectItems.length > 0 || addToCartItems.length > 0

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <article className="border border-line bg-white/40 p-5">
          <div className="flex items-center gap-2 text-muted">
            <Users className="h-4 w-4" strokeWidth={1.5} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Visitantes</p>
          </div>
          <p className="mt-3 font-serif text-3xl tracking-[0.04em] text-ink">
            {stats.visits.toLocaleString('es-AR')}
          </p>
        </article>

        <article className="border border-line bg-white/40 p-5">
          <div className="flex items-center gap-2 text-muted">
            <Eye className="h-4 w-4" strokeWidth={1.5} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Vistas</p>
          </div>
          <p className="mt-3 font-serif text-3xl tracking-[0.04em] text-ink">
            {stats.pageViews.toLocaleString('es-AR')}
          </p>
        </article>

        <article className="border border-line bg-white/40 p-5">
          <div className="flex items-center gap-2 text-muted">
            <MousePointerClick className="h-4 w-4" strokeWidth={1.5} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Clics</p>
          </div>
          <p className="mt-3 font-serif text-3xl tracking-[0.04em] text-ink">
            {stats.productClicks.toLocaleString('es-AR')}
          </p>
        </article>

        <article className="border border-line bg-white/40 p-5">
          <div className="flex items-center gap-2 text-muted">
            <Palette className="h-4 w-4" strokeWidth={1.5} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Colores</p>
          </div>
          <p className="mt-3 font-serif text-3xl tracking-[0.04em] text-ink">
            {stats.colorSelections.toLocaleString('es-AR')}
          </p>
        </article>

        <article className="border border-line bg-white/40 p-5">
          <div className="flex items-center gap-2 text-muted">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">Carrito</p>
          </div>
          <p className="mt-3 font-serif text-3xl tracking-[0.04em] text-ink">
            {stats.addToCart.toLocaleString('es-AR')}
          </p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatsDonut
          title="Resumen de actividad"
          segments={[
            { label: 'Visitantes', value: stats.visits, color: '#111111' },
            { label: 'Vistas', value: stats.pageViews, color: '#c5a059' },
            { label: 'Clics en productos', value: stats.productClicks, color: '#7a7a7a' },
            { label: 'Colores elegidos', value: stats.colorSelections, color: '#d4b87a' },
            { label: 'Agregados al carrito', value: stats.addToCart, color: '#4a4a4a' },
          ].filter((s) => s.value > 0)}
        />

        <StatsBarChart
          title="Productos más clickeados"
          items={productClickItems.slice(0, 8)}
          emptyMessage="Todavía no hay clics en productos."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatsBarChart
          title="Colores elegidos por producto"
          items={colorSelectItems.slice(0, 10)}
          emptyMessage="Todavía no se eligieron colores."
        />

        <StatsBarChart
          title="Agregados al carrito por variante"
          items={addToCartItems.slice(0, 10)}
          emptyMessage="Todavía no se agregaron productos al carrito."
        />
      </div>

      {hasProductData ? (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted" strokeWidth={1.5} />
            <h3 className="font-serif text-xl tracking-[0.06em]">Detalle por producto y color</h3>
          </div>
          <div className="overflow-x-auto border border-line bg-white/30">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-[#f3f1ec] text-[11px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Color</th>
                  <th className="px-4 py-3 font-semibold text-right">Clics</th>
                  <th className="px-4 py-3 font-semibold text-right">Color elegido</th>
                  <th className="px-4 py-3 font-semibold text-right">Al carrito</th>
                </tr>
              </thead>
              <tbody>
                {detailRows.map((row) => (
                  <tr key={row.key} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-3 text-ink">
                      {resolveProductName(products, row.productId)}
                    </td>
                    <td className="px-4 py-3">
                      {row.color === '—' ? (
                        <span className="text-muted">—</span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{
                              backgroundColor: resolveColorHex(products, row.productId, row.color),
                            }}
                          />
                          <span className="text-ink">{row.color}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">
                      {row.clicks > 0 ? row.clicks.toLocaleString('es-AR') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">
                      {row.colorSelections > 0 ? row.colorSelections.toLocaleString('es-AR') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">
                      {row.addToCart > 0 ? row.addToCart.toLocaleString('es-AR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-[13px] text-muted">Todavía no hay interacciones registradas en productos.</p>
      )}
    </div>
  )
}
