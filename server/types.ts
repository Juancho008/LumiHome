export type ProductBadge = 'destacado' | 'por-agotar' | 'promocion' | 'descuento' | ''

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
  badge?: ProductBadge
  discountPercent?: number
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

export type CatalogContact = {
  email: string
  phone: string
}

export type Catalog = {
  banners: CatalogBanner[]
  categories: CatalogCategory[]
  products: CatalogProduct[]
  contact: CatalogContact
}

export const CATALOG_KEY = 'catalog'

export function defaultContact(): CatalogContact {
  return { email: 'hola@lumihome.com', phone: '' }
}

export function emptyCatalog(): Catalog {
  return { banners: [], categories: [], products: [], contact: defaultContact() }
}

export function normalizeCatalog(raw: unknown): Catalog {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Partial<Catalog>
  return {
    banners: Array.isArray(data.banners) ? data.banners : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
    products: Array.isArray(data.products) ? data.products : [],
    contact: {
      email: typeof data.contact?.email === 'string' ? data.contact.email : defaultContact().email,
      phone: typeof data.contact?.phone === 'string' ? data.contact.phone : '',
    },
  }
}
