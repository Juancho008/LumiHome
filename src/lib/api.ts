import type {
  Catalog,
  CatalogBanner,
  CatalogCategory,
  CatalogContact,
  CatalogProduct,
} from '../types/catalog'
import { normalizeCatalog } from '../types/catalog'

const TOKEN_KEY = 'lumi-admin-token'

export function getAdminToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    return data.error || res.statusText
  } catch {
    return res.statusText || 'Error de red'
  }
}

function authHeaders(): HeadersInit {
  const token = getAdminToken()
  return token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : { 'Content-Type': 'application/json' }
}

export async function fetchCatalog(): Promise<Catalog> {
  const res = await fetch('/api/catalog')
  if (!res.ok) throw new Error(await parseError(res))
  return normalizeCatalog(await res.json())
}

export async function loginAdmin(token: string): Promise<void> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  setAdminToken(token)
}

export async function saveBanners(banners: CatalogBanner[]): Promise<Catalog> {
  const res = await fetch('/api/admin/banners', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ banners }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Catalog>
}

export async function saveCategories(categories: CatalogCategory[]): Promise<Catalog> {
  const res = await fetch('/api/admin/categories', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ categories }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Catalog>
}

export async function saveContact(contact: CatalogContact): Promise<Catalog> {
  const res = await fetch('/api/admin/contact', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ contact }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Catalog>
}

export async function createProduct(product: CatalogProduct): Promise<Catalog> {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Catalog>
}

export async function updateProduct(id: string, product: CatalogProduct): Promise<Catalog> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Catalog>
}

export async function deleteProduct(id: string): Promise<Catalog> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Catalog>
}
