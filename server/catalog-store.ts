import { CATALOG_KEY, emptyCatalog, type Catalog } from './types'
import { createSeedCatalog } from './seed'

type KvConfig = {
  accountId: string
  namespaceId: string
  apiToken: string
}

function getKvConfig(): KvConfig {
  const accountId = process.env.CF_ACCOUNT_ID || ''
  const namespaceId = process.env.CF_KV_NAMESPACE_ID || ''
  const apiToken = process.env.CF_API_TOKEN || ''
  if (!accountId || !namespaceId || !apiToken) {
    const error = new Error('El servidor no está configurado.') as Error & {
      statusCode?: number
    }
    error.statusCode = 503
    throw error
  }
  return { accountId, namespaceId, apiToken }
}

function valueUrl(config: KvConfig, key: string) {
  return `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/storage/kv/namespaces/${config.namespaceId}/values/${encodeURIComponent(key)}`
}

export async function kvGet(key: string): Promise<string | null> {
  const config = getKvConfig()
  const res = await fetch(valueUrl(config, key), {
    headers: { Authorization: `Bearer ${config.apiToken}` },
  })
  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`KV get falló (${res.status}): ${body}`)
  }
  return res.text()
}

export async function kvPut(key: string, value: string): Promise<void> {
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
    const body = await res.text()
    throw new Error(`KV put falló (${res.status}): ${body}`)
  }
}

export async function readCatalog(): Promise<Catalog> {
  const raw = await kvGet(CATALOG_KEY)
  if (!raw) {
    const seed = createSeedCatalog()
    await writeCatalog(seed)
    return seed
  }
  try {
    return JSON.parse(raw) as Catalog
  } catch {
    return emptyCatalog()
  }
}

export async function writeCatalog(catalog: Catalog): Promise<void> {
  const payload = JSON.stringify(catalog)
  if (payload.length > 24 * 1024 * 1024) {
    const error = new Error(
      'El catálogo supera el límite de KV (25 MB). Reducí el tamaño de las imágenes.',
    ) as Error & { statusCode?: number }
    error.statusCode = 413
    throw error
  }
  await kvPut(CATALOG_KEY, payload)
}

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN || ''
}

export function isAuthorized(header: string | undefined): boolean {
  const expected = getAdminToken()
  if (!expected) return false
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : ''
  return Boolean(token && token === expected)
}
