import { useEffect } from 'react'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { formatPrice, useCart } from '../context/CartContext'

export function CartDrawer() {
  const {
    items,
    isOpen,
    subtotal,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart()

  useEffect(() => {
    if (!isOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeCart])

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-ink/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-cream shadow-[-12px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-5">
          <div>
            <p className="font-serif text-2xl tracking-[0.04em] text-ink">Tu carrito</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">
              {items.length === 0
                ? 'Vacío'
                : `${items.reduce((n, i) => n + i.quantity, 0)} producto${
                    items.reduce((n, i) => n + i.quantity, 0) === 1 ? '' : 's'
                  }`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-55"
            aria-label="Cerrar carrito"
          >
            <X size={20} strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <ShoppingBag size={28} strokeWidth={1.2} className="text-muted" />
              <p className="mt-4 font-serif text-xl text-ink">Tu carrito está vacío</p>
              <p className="mt-2 text-[13px] text-muted">
                Explorá la tienda y sumá piezas para tu hogar.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-8 bg-ink px-6 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-gold hover:text-ink"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-line pb-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 shrink-0 object-cover bg-[#efece6]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-lg leading-tight text-ink">{item.name}</h3>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">
                          Color: {item.color}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink hover:bg-ink/5"
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="min-w-8 text-center text-sm text-ink">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink hover:bg-ink/5"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm tracking-[0.04em] text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-line px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted">Subtotal</span>
              <span className="font-serif text-2xl text-ink">{formatPrice(subtotal)}</span>
            </div>
            <button
              type="button"
              className="mt-5 w-full bg-ink px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold hover:text-ink"
            >
              Finalizar compra
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full py-2 text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
            >
              Vaciar carrito
            </button>
          </div>
        ) : null}
      </aside>
    </>
  )
}
