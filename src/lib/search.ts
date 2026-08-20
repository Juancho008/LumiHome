import type { CatalogCategory, CatalogProduct } from '../types/catalog'

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function categoryTitle(
  categories: CatalogCategory[],
  categoryId?: string,
): string {
  if (!categoryId) return ''
  return categories.find((item) => item.id === categoryId)?.title ?? ''
}

export function matchingCategories(
  categories: CatalogCategory[],
  query: string,
): CatalogCategory[] {
  const q = normalizeText(query)
  if (!q) return []
  return categories.filter((category) => normalizeText(category.title).includes(q))
}

export function filterProducts(
  products: CatalogProduct[],
  categories: CatalogCategory[],
  opts: { query?: string; categoryId?: string },
): CatalogProduct[] {
  const query = normalizeText(opts.query ?? '')
  const categoryId = opts.categoryId ?? ''
  const queryCatIds = new Set(matchingCategories(categories, query).map((c) => c.id))

  return products.filter((product) => {
    if (categoryId && product.categoryId !== categoryId) return false
    if (!query) return true

    const name = normalizeText(product.name)
    const description = normalizeText(product.description)
    const catName = normalizeText(categoryTitle(categories, product.categoryId))

    return (
      name.includes(query) ||
      description.includes(query) ||
      catName.includes(query) ||
      Boolean(product.categoryId && queryCatIds.has(product.categoryId))
    )
  })
}

export function searchSuggestions(
  products: CatalogProduct[],
  categories: CatalogCategory[],
  query: string,
  limit = 6,
): { categories: CatalogCategory[]; products: CatalogProduct[] } {
  const q = normalizeText(query)
  if (q.length < 1) return { categories: [], products: [] }

  return {
    categories: matchingCategories(categories, q).slice(0, 4),
    products: filterProducts(products, categories, { query: q }).slice(0, limit),
  }
}
