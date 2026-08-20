import { useCatalog } from '../context/CatalogContext'
import { useShop } from '../context/ShopContext'

export function CategoryPills() {
  const { catalog } = useCatalog()
  const { categoryId, query, applyCategory, clearFilters } = useShop()

  if (catalog.categories.length === 0) return null

  return (
    <div className="mt-8 overflow-x-auto">
      <div className="flex min-w-max items-center gap-2">
        <button
          type="button"
          onClick={clearFilters}
          className={`shrink-0 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
            !categoryId && !query
              ? 'bg-ink text-cream'
              : 'border border-line bg-white/40 text-ink hover:border-ink'
          }`}
        >
          Todas
        </button>
        {catalog.categories.map((category) => {
          const active = categoryId === category.id && !query
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => applyCategory(category.id)}
              className={`shrink-0 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                active
                  ? 'bg-ink text-cream'
                  : 'border border-line bg-white/40 text-ink hover:border-ink'
              }`}
            >
              {category.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}
