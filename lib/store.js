import { createSeedCatalog } from './seed.js'

const CATALOG_KEY = 'catalog'

function getKvConfig() {
  const accountId = process.env.CF_ACCOUNT_ID || ''
  const namespaceId = process.env.CF_KV_NAMESPACE_ID || ''
  const apiToken = process.env.CF_API_TOKEN || ''
  if (!accountId || !namespaceId || !apiToken) {
    const error = new Error('El servidor no está configurado.')
    error.statusCode = 503
    throw error
  }
  return { accountId, namespaceId, apiToken }
}

function valueUrl(config, key) {
  return `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${encodeURIComponent(key)}`
}

async function kvGet(key) {
  const config = getKvConfig()
  const res = await fetch(valueUrl(config, key), {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })
  if (res.status === 404) return null
  if (!res.ok) {
    const error = new Error('No se pudo leer el catálogo.')
    error.statusCode = 502
    throw error
  }
  return res.text()
}

async function kvPut(key, value) {
  const config = getKvConfig()
  const res = await fetch(valueUrl(config, key), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Content-Type': 'text/plain; charset=utf-8',
    },
    body: value,
  })
  if (!res.ok) {
    const error = new Error('No se pudo guardar el catálogo.')
    error.statusCode = 502
    throw error
  }
}

export async function readCatalog() {
  const raw = await kvGet(CATALOG_KEY)
  if (!raw) {
    const seed = createSeedCatalog()
    await writeCatalog(seed)
    return seed
  }
  try {
    const parsed = JSON.parse(raw)
    return {
      banners: Array.isArray(parsed.banners) ? parsed.banners : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
      contact: {
        email: typeof parsed.contact?.email === 'string' ? parsed.contact.email : 'hola@lumihome.com',
        phone: typeof parsed.contact?.phone === 'string' ? parsed.contact.phone : '',
      },
    }
  } catch {
    return { banners: [], categories: [], products: [], contact: { email: 'hola@lumihome.com', phone: '' } }
  }
}

export async function writeCatalog(catalog) {
  const payload = JSON.stringify(catalog)
  if (payload.length > 24 * 1024 * 1024) {
    const error = new Error('El catálogo es demasiado grande. Reducí el tamaño de las imágenes.')
    error.statusCode = 413
    throw error
  }
  await kvPut(CATALOG_KEY, payload)
}

export function getAdminToken() {
  return process.env.ADMIN_TOKEN || ''
}

export function isAuthorized(header) {
  const expected = getAdminToken()
  if (!expected) return false
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : ''
  return Boolean(token && token === expected)
}
