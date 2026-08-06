import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export type ProductColor = {
  name: string
  hex: string
}

export type Product = {
  name: string
  price: string
  image: string
  description: string
  colors: ProductColor[]
}

type ProductModalProps = {
  product: Product | null
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

  const handleAdd = () => {
    addItem(product, selectedColor || product.colors[0]?.name || 'Único')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/45 px-4 py-8 backdrop-blur-[2px] animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="animate-fade-up relative grid max-h-[90vh] w-full max-w-[920px] overflow-hidden bg-cream shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:grid-cols-2"
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

        <div className="bg-[#efece6]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full max-h-[42vh] w-full object-cover md:max-h-none md:min-h-[520px]"
          />
        </div>

        <div className="flex flex-col overflow-y-auto px-6 py-8 md:px-10 md:py-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
            Lumi Home
          </p>
          <h2
            id="product-modal-title"
            className="mt-3 font-serif text-3xl font-medium tracking-[0.03em] text-ink md:text-4xl"
          >
            {product.name}
          </h2>
          <p className="mt-3 text-sm tracking-[0.04em] text-muted">{product.price}</p>
          <p className="mt-6 text-[13px] leading-relaxed text-ink/75">{product.description}</p>

          <div className="mt-auto pt-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
              Colores disponibles
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const selected = selectedColor === color.name
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => onSelectColor(color.name)}
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

            <button
              type="button"
              onClick={handleAdd}
              className="mt-8 w-full bg-ink px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:bg-gold hover:text-ink"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
