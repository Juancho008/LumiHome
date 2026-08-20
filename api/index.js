import {
  getAdminToken,
  isAuthorized,
  readCatalog,
  writeCatalog,
} from '../lib/store.js'
import { readStats, recordEvent } from '../lib/stats.js'

function getRoute(req) {
  const fromQuery = req.query?.route
  if (Array.isArray(fromQuery)) return fromQuery.filter(Boolean).join('/')
  if (typeof fromQuery === 'string' && fromQuery) return fromQuery.replace(/^\/+|\/+$/g, '')

  const url = new URL(req.url || '/', 'http://localhost')
  return url.pathname.replace(/^\/api\/?/, '').replace(/^\/+|\/+$/g, '')
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body) {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return {}
}

function send(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function isValidProduct(product) {
  if (!product || typeof product !== 'object') return false
  if (typeof product.name !== 'string' || !product.name.trim()) return false
  if (typeof product.price !== 'string') return false
  if (typeof product.description !== 'string') return false
  if (!Array.isArray(product.colors) || product.colors.length === 0) return false
  const badges = ['', 'destacado', 'por-agotar', 'promocion', 'descuento']
  if (product.badge != null && !badges.includes(product.badge)) return false
  if (product.discountPercent != null) {
    const n = Number(product.discountPercent)
    if (!Number.isFinite(n) || n < 0 || n > 100) return false
  }
  return product.colors.every(
    (color) =>
      color &&
      typeof color.name === 'string' &&
      color.name.trim() &&
      typeof color.hex === 'string' &&
      color.hex.trim() &&
      typeof color.image === 'string',
  )
}

export default async function handler(req, res) {
  try {
    const method = req.method || 'GET'
    const route = getRoute(req)
    const parts = route.split('/').filter(Boolean)

    if (route === 'catalog' && method === 'GET') {
      return send(res, 200, await readCatalog())
    }

    if (route === 'events' && method === 'POST') {
      const event = readBody(req)
      await recordEvent(event)
      return send(res, 200, { ok: true })
    }

    if (route === 'admin/stats' && method === 'GET') {
      if (!isAuthorized(req.headers.authorization)) {
        return send(res, 401, { error: 'No autorizado' })
      }
      return send(res, 200, await readStats())
    }

    if (route === 'admin/login' && method === 'POST') {
      const token = String(readBody(req).token || '').trim()
      const expected = getAdminToken()
      if (!expected || token !== expected) {
        return send(res, 401, { error: 'No autorizado' })
      }
      return send(res, 200, { ok: true })
    }

    if (route === 'admin/banners' && method === 'PUT') {
      if (!isAuthorized(req.headers.authorization)) {
        return send(res, 401, { error: 'No autorizado' })
      }
      const { banners } = readBody(req)
      if (!Array.isArray(banners)) return send(res, 400, { error: 'Datos inválidos' })
      const catalog = await readCatalog()
      catalog.banners = banners
      await writeCatalog(catalog)
      return send(res, 200, catalog)
    }

    if (route === 'admin/categories' && method === 'PUT') {
      if (!isAuthorized(req.headers.authorization)) {
        return send(res, 401, { error: 'No autorizado' })
      }
      const { categories } = readBody(req)
      if (!Array.isArray(categories)) return send(res, 400, { error: 'Datos inválidos' })
      const catalog = await readCatalog()
      catalog.categories = categories
      await writeCatalog(catalog)
      return send(res, 200, catalog)
    }

    if (route === 'admin/contact' && method === 'PUT') {
      if (!isAuthorized(req.headers.authorization)) {
        return send(res, 401, { error: 'No autorizado' })
      }
      const body = readBody(req)
      const contact = body.contact && typeof body.contact === 'object' ? body.contact : body
      const email = typeof contact.email === 'string' ? contact.email.trim() : ''
      const phone = typeof contact.phone === 'string' ? contact.phone.trim() : ''
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return send(res, 400, { error: 'Correo inválido' })
      }
      if (email.length > 200 || phone.length > 40) {
        return send(res, 400, { error: 'Datos inválidos' })
      }
      const catalog = await readCatalog()
      catalog.contact = { email, phone }
      await writeCatalog(catalog)
      return send(res, 200, catalog)
    }

    if (route === 'admin/products' && method === 'POST') {
      if (!isAuthorized(req.headers.authorization)) {
        return send(res, 401, { error: 'No autorizado' })
      }
      const product = readBody(req)
      if (!product?.id || !isValidProduct(product)) {
        return send(res, 400, { error: 'Producto inválido' })
      }
      const catalog = await readCatalog()
      if (catalog.products.some((item) => item.id === product.id)) {
        return send(res, 409, { error: 'Ya existe un producto con ese id' })
      }
      catalog.products.push(product)
      await writeCatalog(catalog)
      return send(res, 200, catalog)
    }

    if (parts[0] === 'admin' && parts[1] === 'products' && parts[2] && method === 'PUT') {
      if (!isAuthorized(req.headers.authorization)) {
        return send(res, 401, { error: 'No autorizado' })
      }
      const id = parts[2]
      const product = readBody(req)
      if (!isValidProduct(product)) {
        return send(res, 400, { error: 'Producto inválido' })
      }
      const catalog = await readCatalog()
      const index = catalog.products.findIndex((item) => item.id === id)
      if (index < 0) return send(res, 404, { error: 'Producto no encontrado' })
      catalog.products[index] = { ...product, id }
      await writeCatalog(catalog)
      return send(res, 200, catalog)
    }

    if (parts[0] === 'admin' && parts[1] === 'products' && parts[2] && method === 'DELETE') {
      if (!isAuthorized(req.headers.authorization)) {
        return send(res, 401, { error: 'No autorizado' })
      }
      const id = parts[2]
      const catalog = await readCatalog()
      const next = catalog.products.filter((item) => item.id !== id)
      if (next.length === catalog.products.length) {
        return send(res, 404, { error: 'Producto no encontrado' })
      }
      catalog.products = next
      await writeCatalog(catalog)
      return send(res, 200, catalog)
    }

    return send(res, 404, { error: 'Ruta no encontrada' })
  } catch (err) {
    const status = Number(err?.statusCode) || 500
    return send(res, status, { error: err?.message || 'Error interno' })
  }
}
