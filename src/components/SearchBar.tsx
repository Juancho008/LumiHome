import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Search, X } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { useShop } from '../context/ShopContext'
import { categoryTitle, searchSuggestions } from '../lib/search'

type SearchBarProps = {
  open: boolean
  onOpen: () => void
  onClose: () => void
}

export function SearchBar({ open, onOpen, onClose }: SearchBarProps) {
  const { catalog } = useCatalog()
  const { query, applySearch, applyCategory } = useShop()
  const [value, setValue] = useState(query)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(query)
  }, [query])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const suggestions = useMemo(
    () => searchSuggestions(catalog.products, catalog.categories, value),
    [catalog.categories, catalog.products, value],
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    applySearch(value)
    onClose()
  }

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-60"
        aria-label="Buscar"
        onClick={onOpen}
      >
        <Search size={20} strokeWidth={1.4} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] bg-cream/96 backdrop-blur-md animate-fade-in">
          <div className="mx-auto flex h-full max-w-[720px] flex-col px-4 pt-6 md:px-6 md:pt-10">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Buscar en Lumi Home
              </p>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center text-ink"
                aria-label="Cerrar búsqueda"
              >
                <X size={22} strokeWidth={1.4} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6">
              <label className="relative block">
                <Search
                  size={18}
                  strokeWidth={1.4}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Buscá productos o categorías, ej. cocina"
                  className="w-full border-b border-ink bg-transparent py-3 pl-12 pr-4 text-[16px] outline-none placeholder:text-muted"
                />
              </label>
            </form>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pb-10">
              {value.trim() ? (
                <>
                  {suggestions.categories.length > 0 ? (
                    <section>
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                        Categorías
                      </h3>
                      <ul className="mt-3 divide-y divide-line border-y border-line">
                        {suggestions.categories.map((category) => (
                          <li key={category.id}>
                            <button
                              type="button"
                              onClick={() => {
                                applyCategory(category.id)
                                onClose()
                              }}
                              className="flex w-full items-center justify-between py-3 text-left"
                            >
                              <span className="font-serif text-lg text-ink">{category.title}</span>
                              <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                                Ver categoría
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {suggestions.products.length > 0 ? (
                    <section className="mt-8">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                        Productos
                      </h3>
                      <ul className="mt-3 divide-y divide-line border-y border-line">
                        {suggestions.products.map((product) => (
                          <li key={product.id}>
                            <button
                              type="button"
                              onClick={() => {
                                applySearch(product.name)
                                onClose()
                              }}
                              className="flex w-full items-center gap-3 py-3 text-left"
                            >
                              {product.colors[0]?.image ? (
                                <img
                                  src={product.colors[0].image}
                                  alt=""
                                  className="h-14 w-12 shrink-0 object-cover bg-[#efece6]"
                                />
                              ) : (
                                <span className="h-14 w-12 shrink-0 bg-[#efece6]" />
                              )}
                              <span className="min-w-0">
                                <span className="block truncate font-serif text-lg text-ink">
                                  {product.name}
                                </span>
                                <span className="mt-0.5 block text-[11px] uppercase tracking-[0.12em] text-muted">
                                  {categoryTitle(catalog.categories, product.categoryId) ||
                                    'Sin categoría'}
                                </span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}

                  {suggestions.categories.length === 0 && suggestions.products.length === 0 ? (
                    <p className="text-sm text-muted">
                      No encontramos resultados para “{value.trim()}”.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        applySearch(value)
                        onClose()
                      }}
                      className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink underline underline-offset-4"
                    >
                      Ver todos los resultados
                    </button>
                  )}
                </>
              ) : catalog.categories.length > 0 ? (
                <section>
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Categorías
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {catalog.categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          applyCategory(category.id)
                          onClose()
                        }}
                        className="border border-line bg-white/50 px-3 py-2 text-[12px] font-medium text-ink transition-colors hover:border-ink"
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-sm text-muted">Escribí el nombre de un producto o una categoría.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
