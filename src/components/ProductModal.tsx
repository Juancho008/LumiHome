import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { trackColorSelect } from '../lib/track'
import type { CatalogProduct } from '../types/catalog'
import { ProductBadges, ProductPrice } from './ProductBadges'

type ProductModalProps = {
  product: CatalogProduct | null
  selectedColor: string
  onSelectColor: (name: string) => void
  onClose: () => void
}

export function ProductModal({
  product,
  selectedColor,
  onSelectColor,
  onClose,
}: ProductModalProps) {
  const { addItem } = useCart()

  useEffect(() => {
    if (!product) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [product, onClose])

  if (!product) return null

  const activeColor =
    product.colors.find((c) => c.name === selectedColor) || product.colors[0]

  const handleColorSelect = (colorName: string) => {
    trackColorSelect(product.id, colorName)
    onSelectColor(colorName)
  }

  const handleAdd = () => {
    if (!activeColor) return
    addItem(product, activeColor.name)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/45 px-0 py-0 backdrop-blur-[2px] animate-fade-in sm:items-center sm:px-4 sm:py-6 md:py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="animate-fade-up relative flex max-h-[92dvh] w-full max-w-[920px] flex-col overflow-hidden bg-cream shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:max-h-[90vh] md:grid md:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-55 md:right-4 md:top-4"
          aria-label="Cerrar"
        >
          <X size={20} strokeWidth={1.4} />
        </button>

        <div className="relative shrink-0 bg-[#efece6]">
          <ProductBadges product={product} />
          {activeColor?.image ? (
            <img
              key={activeColor.name}
              src={activeColor.image}
              alt={`${product.name} — ${activeColor.name}`}
              className="h-full max-h-[32vh] w-full object-cover animate-fade-in sm:max-h-[36vh] md:max-h-none md:min-h-[520px]"
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center text-[12px] text-muted sm:min-h-[240px] md:min-h-[520px]">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6 md:px-10 md:py-12">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
              Lumi Home
            </p>
            <h2
              id="product-modal-title"
              className="mt-2 font-serif text-2xl font-medium tracking-[0.03em] text-ink sm:mt-3 sm:text-3xl md:text-4xl"
            >
              {product.name}
            </h2>
            <ProductPrice product={product} className="mt-2 text-sm sm:mt-3" />
            <p className="mt-4 text-[13px] leading-relaxed text-ink/75 sm:mt-6">
              {product.description}
            </p>

            <div className="mt-6 sm:mt-8 md:mt-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
                Colores disponibles
              </p>
              <div className="mt-3 flex flex-wrap gap-3 sm:mt-4">
                {product.colors.map((color) => {
                  const selected = selectedColor === color.name
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorSelect(color.name)}
                      className={`group flex flex-col items-center gap-2 ${selected ? '' : 'opacity-80'}`}
                      aria-label={`Color ${color.name}`}
                      aria-pressed={selected}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                          selected
                            ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-cream'
                            : 'border-line hover:border-ink/40'
                        }`}
                      >
                        <span
                          className="h-7 w-7 rounded-full border border-black/5"
                          style={{ backgroundColor: color.hex }}
                        />
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-[0.12em] ${
                          selected ? 'text-ink' : 'text-muted'
                        }`}
                      >
                        {color.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-line/50 bg-cream px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 md:border-0 md:px-10 md:pb-12 md:pt-0">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-ink px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:bg-gold hover:text-ink"
            >
              Agregar a carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
