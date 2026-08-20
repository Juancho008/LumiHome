const STATS_KEY = 'stats'

function emptyStats() {
  return { visits: 0, pageViews: 0, productClicks: 0, byProduct: {}, updatedAt: Date.now() }
}

function normalizeStats(raw) {
  const data = raw && typeof raw === 'object' ? raw : {}
  const byProduct =
    data.byProduct && typeof data.byProduct === 'object' && !Array.isArray(data.byProduct)
      ? Object.fromEntries(
          Object.entries(data.byProduct).filter(
            ([k, v]) => typeof k === 'string' && typeof v === 'number' && Number.isFinite(v),
          ),
        )
      : {}
  return {
    visits: typeof data.visits === 'number' && data.visits >= 0 ? data.visits : 0,
    pageViews: typeof data.pageViews === 'number' && data.pageViews >= 0 ? data.pageViews : 0,
    productClicks:
      typeof data.productClicks === 'number' && data.productClicks >= 0 ? data.productClicks : 0,
    byProduct,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  }
}

function applyEvent(stats, event) {
  const next = {
    ...stats,
    byProduct: { ...stats.byProduct },
    updatedAt: Date.now(),
  }
  if (event.type === 'visit') {
    next.visits += 1
  } else if (event.type === 'page_view') {
    next.pageViews += 1
  } else if (event.type === 'product_click' && event.productId) {
    next.productClicks += 1
    next.byProduct[event.productId] = (next.byProduct[event.productId] || 0) + 1
  }
  return next
}

function isValidEvent(body) {
  if (!body || typeof body !== 'object') return false
  const { type, productId } = body
  if (type === 'visit' || type === 'page_view') return true
  if (type === 'product_click') return typeof productId === 'string' && productId.trim().length > 0
  return false
}

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
    const error = new Error('No se pudieron leer las estadísticas.')
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
    const error = new Error('No se pudieron guardar las estadísticas.')
    error.statusCode = 502
    throw error
  }
}

export async function readStats() {
  const raw = await kvGet(STATS_KEY)
  if (!raw) return emptyStats()
  try {
    return normalizeStats(JSON.parse(raw))
  } catch {
    return emptyStats()
  }
}

export async function recordEvent(event) {
  if (!isValidEvent(event)) {
    const error = new Error('Evento inválido')
    error.statusCode = 400
    throw error
  }
  const stats = await readStats()
  const next = applyEvent(stats, event)
  await kvPut(STATS_KEY, JSON.stringify(next))
  return next
}
