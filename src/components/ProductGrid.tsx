import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'
import { trackProductClick } from '../lib/track'
import { categoryTitle, filterProducts } from '../lib/search'
import type { CatalogProduct } from '../types/catalog'
import { CategoryPills } from './CategoryPills'
import { ProductBadges, ProductPrice } from './ProductBadges'
import { ProductDescription } from './ProductDescription'
import { ProductModal } from './ProductModal'

export function ProductGrid() {
  const { catalog, loading } = useCatalog()
  const { addItem } = useCart()
  const { query, categoryId, applyCategory, clearFilters } = useShop()
  const [selected, setSelected] = useState<CatalogProduct | null>(null)
  const [selectedColor, setSelectedColor] = useState('')

  const products = filterProducts(catalog.products, catalog.categories, { query, categoryId })
  const activeCategory = catalog.categories.find((item) => item.id === categoryId)
  const asList = Boolean(query.trim())

  const openProduct = (product: CatalogProduct) => {
    trackProductClick(product.id)
    setSelected(product)
    setSelectedColor(product.colors[0]?.name ?? '')
  }

  const addProduct = (product: CatalogProduct) => {
    const color = product.colors[0]?.name
    if (!color) return
    addItem(product, color)
  }

  const heading = query.trim()
    ? `Resultados para “${query.trim()}”`
    : activeCategory
      ? activeCategory.title
      : 'Lumi Icons'

  return (
    <section id="tienda" className="scroll-mt-28 bg-cream px-4 py-16 md:scroll-mt-40 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-center font-serif text-3xl font-medium uppercase tracking-[0.14em] text-ink md:text-4xl">
          {heading}
        </h2>
        <p className="mt-3 text-center text-[12px] uppercase tracking-[0.16em] text-muted">
          {loading
            ? 'Cargando productos…'
            : `${products.length} ${products.length === 1 ? 'producto' : 'productos'}`}
        </p>

        <nav className="mt-6 flex flex-wrap items-center justify-center gap-1 text-[12px] text-muted">
          <button type="button" onClick={clearFilters} className="hover:text-ink">
            Tienda
          </button>
          {activeCategory ? (
            <>
              <ChevronRight size={14} strokeWidth={1.5} />
              <span className="text-ink">{activeCategory.title}</span>
            </>
          ) : null}
          {query.trim() ? (
            <>
              <ChevronRight size={14} strokeWidth={1.5} />
              <span className="text-ink">“{query.trim()}”</span>
            </>
          ) : null}
        </nav>

        <CategoryPills />

        {loading ? null : catalog.products.length === 0 ? (
          <p className="mt-12 text-center text-[12px] uppercase tracking-[0.16em] text-muted">
            Todavía no hay productos
          </p>
        ) : products.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="font-serif text-2xl text-ink">No encontramos resultados</p>
            <p className="mt-2 text-sm text-muted">Probá con otra categoría o palabra.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 bg-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream hover:bg-gold hover:text-ink"
            >
              Ver todo
            </button>
          </div>
        ) : asList ? (
          <ul className="mt-10 divide-y divide-line border-y border-line bg-white/30">
            {products.map((product) => {
              const cover = product.colors[0]?.image || ''
              const cat = categoryTitle(catalog.categories, product.categoryId)
              return (
                <li key={product.id}>
                  <article className="flex gap-4 px-3 py-4 md:gap-6 md:px-5 md:py-5">
                    <button
                      type="button"
                      onClick={() => openProduct(product)}
                      className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#efece6] md:h-36 md:w-28"
                    >
                      <ProductBadges product={product} />
                      {cover ? (
                        <img src={cover} alt={product.name} className="h-full w-full object-cover" />
                      ) : null}
                    </button>
                    <div className="min-w-0 flex-1">
                      {cat ? (
                        <button
                          type="button"
                          onClick={() => applyCategory(product.categoryId || '')}
                          className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold hover:text-ink"
                        >
                          {cat}
                        </button>
                      ) : null}
                      <button type="button" onClick={() => openProduct(product)} className="block w-full text-left">
                        <h3 className="mt-1 font-serif text-xl tracking-[0.02em] text-ink md:text-2xl">
                          {product.name}
                        </h3>
                      </button>
                      <ProductPrice product={product} className="mt-2" />
                      <ProductDescription
                        text={product.description}
                        className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink/70 max-md:hidden"
                      />
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <button
                          type="button"
                          onClick={() => openProduct(product)}
                          className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink underline underline-offset-4"
                        >
                          Ver producto
                        </button>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink/70 hover:text-gold"
                        >
                          Agregar a carrito
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
            {products.map((product) => {
              const cover = product.colors[0]?.image || ''
              const cat = categoryTitle(catalog.categories, product.categoryId)
              return (
                <article key={product.id} className="group">
                  <button
                    type="button"
                    onClick={() => openProduct(product)}
                    className="block w-full text-left"
                  >
                    <div className="relative overflow-hidden bg-[#efece6]">
                      <ProductBadges product={product} />
                      {cover ? (
                        <img
                          src={cover}
                          alt={product.name}
                          className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="aspect-[4/5] w-full bg-[#efece6]" />
                      )}
                    </div>
                    {cat ? (
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {cat}
                      </p>
                    ) : null}
                    <h3 className="mt-1 font-serif text-lg tracking-[0.02em] text-ink md:text-xl">
                      {product.name}
                    </h3>
                    <ProductPrice product={product} className="mt-1" />
                  </button>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <button
                      type="button"
                      onClick={() => openProduct(product)}
                      className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink underline decoration-transparent underline-offset-4 transition-all duration-300 hover:decoration-ink"
                    >
                      Ver producto
                    </button>
                    <button
                      type="button"
                      onClick={() => addProduct(product)}
                      className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-gold"
                    >
                      Agregar a carrito
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <ProductModal
        product={selected}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}
