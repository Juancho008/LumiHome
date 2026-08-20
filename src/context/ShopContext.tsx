import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCatalog } from './CatalogContext'
import { normalizeText } from '../lib/search'

type ShopContextValue = {
  query: string
  categoryId: string
  applySearch: (query: string) => void
  applyCategory: (categoryId: string) => void
  clearFilters: () => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

function scrollToShop() {
  window.requestAnimationFrame(() => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams()
  const { catalog } = useCatalog()
  const query = params.get('q') ?? ''
  const categoryId = params.get('cat') ?? ''

  const commit = useCallback(
    (nextQuery: string, nextCategory: string, scroll: boolean) => {
      const next = new URLSearchParams()
      if (nextQuery) next.set('q', nextQuery)
      if (nextCategory) next.set('cat', nextCategory)
      setParams(next, { replace: true })
      if (scroll) scrollToShop()
    },
    [setParams],
  )

  const applySearch = useCallback(
    (raw: string) => {
      const nextQuery = raw.trim()
      const exact = catalog.categories.find(
        (category) => normalizeText(category.title) === normalizeText(nextQuery),
      )
      commit(nextQuery, exact?.id ?? '', true)
    },
    [catalog.categories, commit],
  )

  const applyCategory = useCallback(
    (id: string) => {
      commit('', id, true)
    },
    [commit],
  )

  const clearFilters = useCallback(() => {
    commit('', '', true)
  }, [commit])

  const value = useMemo(
    () => ({ query, categoryId, applySearch, applyCategory, clearFilters }),
    [query, categoryId, applySearch, applyCategory, clearFilters],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop debe usarse dentro de ShopProvider')
  }
  return context
}
