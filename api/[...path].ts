import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getAdminToken,
  isAuthorized,
  readCatalog,
  writeCatalog,
} from '../server/catalog-store'
import type { CatalogBanner, CatalogCategory, CatalogProduct } from '../server/types'

export const config = {
  runtime: 'nodejs',
  maxDuration: 30,
}

function pathParts(req: VercelRequest): string[] {
  const slug = req.query.path
  if (Array.isArray(slug)) return slug.filter(Boolean)
  if (typeof slug === 'string' && slug) return slug.split('/').filter(Boolean)
  return []
}

function methodNotAllowed(res: VercelResponse, allow: string[]) {
  res.setHeader('Allow', allow.join(', '))
  return res.status(405).json({ error: 'Método no permitido' })
}

function unauthorized(res: VercelResponse) {
  return res.status(401).json({ error: 'No autorizado' })
}

function readBody<T>(req: VercelRequest): T {
  if (req.body && typeof req.body === 'object') return req.body as T
  if (typeof req.body === 'string' && req.body) return JSON.parse(req.body) as T
  return {} as T
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const parts = pathParts(req)
    const method = req.method || 'GET'
    const route = parts.join('/')

    if (route === 'catalog' && method === 'GET') {
      const catalog = await readCatalog()
      return res.status(200).json(catalog)
    }

    if (route === 'admin/login' && method === 'POST') {
      const body = readBody<{ token?: string }>(req)
      const token = (body.token || '').trim()
      const expected = getAdminToken()
      if (!expected || token !== expected) return unauthorized(res)
      return res.status(200).json({ ok: true })
    }

    if (route === 'admin/banners' && method === 'PUT') {
      if (!isAuthorized(req.headers.authorization)) return unauthorized(res)
      const body = readBody<{ banners: CatalogBanner[] }>(req)
      if (!Array.isArray(body.banners)) {
        return res.status(400).json({ error: 'banners inválido' })
      }
      const catalog = await readCatalog()
      catalog.banners = body.banners
      await writeCatalog(catalog)
      return res.status(200).json(catalog)
    }

    if (route === 'admin/categories' && method === 'PUT') {
      if (!isAuthorized(req.headers.authorization)) return unauthorized(res)
      const body = readBody<{ categories: CatalogCategory[] }>(req)
      if (!Array.isArray(body.categories)) {
        return res.status(400).json({ error: 'categories inválido' })
      }
      const catalog = await readCatalog()
      catalog.categories = body.categories
      await writeCatalog(catalog)
      return res.status(200).json(catalog)
    }

    if (route === 'admin/products' && method === 'POST') {
      if (!isAuthorized(req.headers.authorization)) return unauthorized(res)
      const product = readBody<CatalogProduct>(req)
      if (!product?.id || !product?.name || !Array.isArray(product.colors)) {
        return res.status(400).json({ error: 'producto inválido' })
      }
      const catalog = await readCatalog()
      if (catalog.products.some((item) => item.id === product.id)) {
        return res.status(409).json({ error: 'Ya existe un producto con ese id' })
      }
      catalog.products.push(product)
      await writeCatalog(catalog)
      return res.status(200).json(catalog)
    }

    if (parts[0] === 'admin' && parts[1] === 'products' && parts[2] && method === 'PUT') {
      if (!isAuthorized(req.headers.authorization)) return unauthorized(res)
      const id = parts[2]
      const product = readBody<CatalogProduct>(req)
      const catalog = await readCatalog()
      const index = catalog.products.findIndex((item) => item.id === id)
      if (index < 0) return res.status(404).json({ error: 'Producto no encontrado' })
      catalog.products[index] = { ...product, id }
      await writeCatalog(catalog)
      return res.status(200).json(catalog)
    }

    if (parts[0] === 'admin' && parts[1] === 'products' && parts[2] && method === 'DELETE') {
      if (!isAuthorized(req.headers.authorization)) return unauthorized(res)
      const id = parts[2]
      const catalog = await readCatalog()
      const next = catalog.products.filter((item) => item.id !== id)
      if (next.length === catalog.products.length) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }
      catalog.products = next
      await writeCatalog(catalog)
      return res.status(200).json(catalog)
    }

    if (route.startsWith('admin')) {
      return methodNotAllowed(res, ['GET', 'POST', 'PUT', 'DELETE'])
    }

    return res.status(404).json({ error: 'Ruta no encontrada' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    const statusCode =
      err && typeof err === 'object' && 'statusCode' in err
        ? Number((err as { statusCode?: number }).statusCode) || 500
        : 500
    return res.status(statusCode).json({ error: message })
  }
}
