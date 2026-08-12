import { useState } from 'react'
import { useCatalog } from '../context/CatalogContext'
import type { CatalogProduct } from '../types/catalog'
import { ProductModal } from './ProductModal'

export function ProductGrid() {
  const { catalog, loading } = useCatalog()
  const [selected, setSelected] = useState<CatalogProduct | null>(null)
  const [selectedColor, setSelectedColor] = useState('')

  const openProduct = (product: CatalogProduct) => {
    setSelected(product)
    setSelectedColor(product.colors[0]?.name ?? '')
  }

  return (
    <section id="tienda" className="scroll-mt-28 bg-cream px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-center font-serif text-3xl font-medium uppercase tracking-[0.14em] text-ink md:text-4xl">
          Lumi Icons
        </h2>

        {loading ? (
          <p className="mt-12 text-center text-[12px] uppercase tracking-[0.16em] text-muted">
            Cargando productos…
          </p>
        ) : catalog.products.length === 0 ? (
          <p className="mt-12 text-center text-[12px] uppercase tracking-[0.16em] text-muted">
            Todavía no hay productos
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
            {catalog.products.map((product) => {
              const cover = product.colors[0]?.image || ''
              return (
                <article key={product.id} className="group">
                  <button
                    type="button"
                    onClick={() => openProduct(product)}
                    className="block w-full text-left"
                  >
                    <div className="overflow-hidden bg-[#efece6]">
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
                    <h3 className="mt-4 font-serif text-lg tracking-[0.02em] text-ink md:text-xl">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-[12px] tracking-[0.04em] text-muted">{product.price}</p>
                    <span className="mt-3 inline-block text-[10px] font-medium uppercase tracking-[0.18em] text-ink underline decoration-transparent underline-offset-4 transition-all duration-300 group-hover:decoration-ink">
                      Ver producto
                    </span>
                  </button>
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
