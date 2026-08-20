import { useEffect, useState } from 'react'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { useShop } from '../context/ShopContext'
import { Logo } from './Logo'
import { SearchBar } from './SearchBar'

const navItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Tienda', href: '#tienda' },
  { label: 'Contacto', href: '#contacto' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountHint, setAccountHint] = useState(false)
  const { itemCount, openCart } = useCart()
  const { catalog } = useCatalog()
  const { applyCategory } = useShop()

  useEffect(() => {
    if (!accountHint) return
    const timer = window.setTimeout(() => setAccountHint(false), 2200)
    return () => window.clearTimeout(timer)
  }, [accountHint])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream/95 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md'
            : 'bg-gradient-to-b from-cream/70 to-transparent'
        }`}
      >
        <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-8 md:py-5">
          <button
            type="button"
            className="relative z-10 flex h-10 w-10 items-center justify-center text-ink md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
          </button>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center md:top-[1.1rem] md:translate-y-0">
            <a href="#inicio" className="pointer-events-auto">
              <Logo />
            </a>
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-1 md:gap-2">
            <SearchBar open={searchOpen} onOpen={() => setSearchOpen(true)} onClose={() => setSearchOpen(false)} />
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountHint(true)}
                className="flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-60"
                aria-label="Cuenta"
              >
                <User size={20} strokeWidth={1.4} />
              </button>
              {accountHint ? (
                <span
                  className="pointer-events-none absolute right-0 top-full z-20 mt-1 whitespace-nowrap bg-ink px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cream shadow-[0_4px_16px_rgba(0,0,0,0.12)] animate-fade-in"
                  role="status"
                >
                  Próximamente
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center text-ink transition-opacity hover:opacity-60"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={20} strokeWidth={1.4} />
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] font-medium text-cream">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        <nav className="hidden md:block">
          <ul className="mx-auto flex max-w-[1400px] items-center justify-center gap-x-10 px-6 pb-3 pt-10">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/85 transition-colors duration-200 hover:text-gold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-cream transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-24">
          <ul className="flex flex-col gap-5">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.16em] text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {catalog.categories.length > 0 ? (
            <div className="mt-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Categorías
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {catalog.categories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => {
                        applyCategory(category.id)
                        setOpen(false)
                      }}
                      className="text-sm font-medium uppercase tracking-[0.16em] text-ink"
                    >
                      {category.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
