import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchCatalog } from '../lib/api'
import { createSeedCatalog } from '../../server/seed'
import type { Catalog } from '../types/catalog'
import { emptyCatalog } from '../types/catalog'

type CatalogContextValue = {
  catalog: Catalog
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  setCatalog: (catalog: Catalog) => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(emptyCatalog())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCatalog()
      setCatalog(data)
    } catch (err) {
      setCatalog(createSeedCatalog())
      setError(err instanceof Error ? err.message : 'No se pudo cargar el catálogo')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ catalog, loading, error, refresh, setCatalog }),
    [catalog, loading, error, refresh],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) {
    throw new Error('useCatalog debe usarse dentro de CatalogProvider')
  }
  return context
}
