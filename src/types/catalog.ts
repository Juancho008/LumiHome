export type CatalogColor = {
  name: string
  hex: string
  image: string
}

export type CatalogProduct = {
  id: string
  name: string
  price: string
  description: string
  categoryId?: string
  colors: CatalogColor[]
}

export type CatalogBanner = {
  id: string
  title: string
  subtitle: string
  cta: string
  image: string
}

export type CatalogCategory = {
  id: string
  title: string
  cta: string
  image: string
}

export type Catalog = {
  banners: CatalogBanner[]
  categories: CatalogCategory[]
  products: CatalogProduct[]
}

export const CATALOG_KEY = 'catalog'

export function emptyCatalog(): Catalog {
  return { banners: [], categories: [], products: [] }
}
