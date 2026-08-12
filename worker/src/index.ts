import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type {
  Catalog,
  CatalogBanner,
  CatalogCategory,
  CatalogProduct,
} from '../../src/types/catalog'
import { CATALOG_KEY, emptyCatalog } from '../../src/types/catalog'
import { createSeedCatalog } from './seed'

type Bindings = {
  LUMI_STORE: KVNamespace
  ADMIN_TOKEN: string
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

async function readCatalog(kv: KVNamespace): Promise<Catalog> {
  const raw = await kv.get(CATALOG_KEY, 'text')
  if (!raw) {
    const seed = createSeedCatalog()
    await kv.put(CATALOG_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    return JSON.parse(raw) as Catalog
  } catch {
    return emptyCatalog()
  }
}

async function writeCatalog(kv: KVNamespace, catalog: Catalog): Promise<Response | null> {
  const payload = JSON.stringify(catalog)
  // KV value limit is 25 MiB; leave headroom for encoding overhead
  if (payload.length > 24 * 1024 * 1024) {
    return Response.json(
      { error: 'El catálogo supera el límite de KV (25 MB). Reducí el tamaño de las imágenes.' },
      { status: 413 },
    )
  }
  await kv.put(CATALOG_KEY, payload)
  return null
}

function unauthorized() {
  return Response.json({ error: 'No autorizado' }, { status: 401 })
}

function requireAdmin(c: { req: { header: (name: string) => string | undefined }; env: Bindings }) {
  const header = c.req.header('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  const expected = c.env.ADMIN_TOKEN
  if (!expected || !token || token !== expected) {
    return false
  }
  return true
}

app.get('/api/catalog', async (c) => {
  const catalog = await readCatalog(c.env.LUMI_STORE)
  return c.json(catalog)
})

app.post('/api/admin/login', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as { token?: string }
  const token = (body.token || '').trim()
  if (!c.env.ADMIN_TOKEN || token !== c.env.ADMIN_TOKEN) {
    return unauthorized()
  }
  return c.json({ ok: true })
})

app.put('/api/admin/banners', async (c) => {
  if (!requireAdmin(c)) return unauthorized()
  const body = (await c.req.json()) as { banners: CatalogBanner[] }
  if (!Array.isArray(body.banners)) {
    return c.json({ error: 'banners inválido' }, 400)
  }
  const catalog = await readCatalog(c.env.LUMI_STORE)
  catalog.banners = body.banners
  const err = await writeCatalog(c.env.LUMI_STORE, catalog)
  if (err) return err
  return c.json(catalog)
})

app.put('/api/admin/categories', async (c) => {
  if (!requireAdmin(c)) return unauthorized()
  const body = (await c.req.json()) as { categories: CatalogCategory[] }
  if (!Array.isArray(body.categories)) {
    return c.json({ error: 'categories inválido' }, 400)
  }
  const catalog = await readCatalog(c.env.LUMI_STORE)
  catalog.categories = body.categories
  const err = await writeCatalog(c.env.LUMI_STORE, catalog)
  if (err) return err
  return c.json(catalog)
})

app.post('/api/admin/products', async (c) => {
  if (!requireAdmin(c)) return unauthorized()
  const product = (await c.req.json()) as CatalogProduct
  if (!product?.id || !product?.name || !Array.isArray(product.colors)) {
    return c.json({ error: 'producto inválido' }, 400)
  }
  const catalog = await readCatalog(c.env.LUMI_STORE)
  if (catalog.products.some((p) => p.id === product.id)) {
    return c.json({ error: 'Ya existe un producto con ese id' }, 409)
  }
  catalog.products.push(product)
  const err = await writeCatalog(c.env.LUMI_STORE, catalog)
  if (err) return err
  return c.json(catalog)
})

app.put('/api/admin/products/:id', async (c) => {
  if (!requireAdmin(c)) return unauthorized()
  const id = c.req.param('id')
  const product = (await c.req.json()) as CatalogProduct
  const catalog = await readCatalog(c.env.LUMI_STORE)
  const index = catalog.products.findIndex((p) => p.id === id)
  if (index < 0) return c.json({ error: 'Producto no encontrado' }, 404)
  catalog.products[index] = { ...product, id }
  const err = await writeCatalog(c.env.LUMI_STORE, catalog)
  if (err) return err
  return c.json(catalog)
})

app.delete('/api/admin/products/:id', async (c) => {
  if (!requireAdmin(c)) return unauthorized()
  const id = c.req.param('id')
  const catalog = await readCatalog(c.env.LUMI_STORE)
  const next = catalog.products.filter((p) => p.id !== id)
  if (next.length === catalog.products.length) {
    return c.json({ error: 'Producto no encontrado' }, 404)
  }
  catalog.products = next
  const err = await writeCatalog(c.env.LUMI_STORE, catalog)
  if (err) return err
  return c.json(catalog)
})

app.put('/api/admin/catalog', async (c) => {
  if (!requireAdmin(c)) return unauthorized()
  const catalog = (await c.req.json()) as Catalog
  if (!catalog || !Array.isArray(catalog.banners) || !Array.isArray(catalog.categories) || !Array.isArray(catalog.products)) {
    return c.json({ error: 'catálogo inválido' }, 400)
  }
  const err = await writeCatalog(c.env.LUMI_STORE, catalog)
  if (err) return err
  return c.json(catalog)
})

app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw)
})

export default app
