import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CatalogProduct } from '../types/catalog'
import { parsePrice, productPricing } from '../lib/pricing'
import { trackAddToCart } from '../lib/track'

export type CartItem = {
  id: string
  name: string
  price: number
  priceLabel: string
  image: string
  color: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (product: CatalogProduct, color: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const STORAGE_KEY = 'lumi-home-cart'
const CartContext = createContext<CartContextValue | null>(null)

export { parsePrice, formatPrice } from '../lib/pricing'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, ready])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((v) => !v), [])

  const addItem = useCallback((product: CatalogProduct, color: string) => {
    trackAddToCart(product.id, color)
    const id = `${product.id}::${color}`
    const colorImage =
      product.colors.find((c) => c.name === color)?.image || product.colors[0]?.image || ''
    const pricing = productPricing(product)
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [
        ...prev,
        {
          id,
          name: product.name,
          price: pricing.hasDiscount ? pricing.final : parsePrice(product.price),
          priceLabel: pricing.hasDiscount ? pricing.finalLabel : product.price,
          image: colorImage,
          color,
          quantity: 1,
        },
      ]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
