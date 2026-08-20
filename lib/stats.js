const STATS_KEY = 'stats'

function productColorKey(productId, color) {
  return `${productId}::${color}`
}

function emptyStats() {
  return {
    visits: 0,
    pageViews: 0,
    productClicks: 0,
    colorSelections: 0,
    addToCart: 0,
    byProduct: {},
    byColorSelect: {},
    byAddToCart: {},
    updatedAt: Date.now(),
  }
}

function normalizeCountMap(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return Object.fromEntries(
    Object.entries(raw).filter(
      ([k, v]) => typeof k === 'string' && typeof v === 'number' && Number.isFinite(v) && v >= 0,
    ),
  )
}

function normalizeStats(raw) {
  const data = raw && typeof raw === 'object' ? raw : {}
  return {
    visits: typeof data.visits === 'number' && data.visits >= 0 ? data.visits : 0,
    pageViews: typeof data.pageViews === 'number' && data.pageViews >= 0 ? data.pageViews : 0,
    productClicks:
      typeof data.productClicks === 'number' && data.productClicks >= 0 ? data.productClicks : 0,
    colorSelections:
      typeof data.colorSelections === 'number' && data.colorSelections >= 0 ? data.colorSelections : 0,
    addToCart: typeof data.addToCart === 'number' && data.addToCart >= 0 ? data.addToCart : 0,
    byProduct: normalizeCountMap(data.byProduct),
    byColorSelect: normalizeCountMap(data.byColorSelect),
    byAddToCart: normalizeCountMap(data.byAddToCart),
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
  }
}

function applyEvent(stats, event) {
  const next = {
    ...stats,
    byProduct: { ...stats.byProduct },
    byColorSelect: { ...stats.byColorSelect },
    byAddToCart: { ...stats.byAddToCart },
    updatedAt: Date.now(),
  }

  if (event.type === 'visit') {
    next.visits += 1
  } else if (event.type === 'page_view') {
    next.pageViews += 1
  } else if (event.type === 'product_click' && event.productId) {
    next.productClicks += 1
    next.byProduct[event.productId] = (next.byProduct[event.productId] || 0) + 1
  } else if (event.type === 'color_select' && event.productId && event.color) {
    const key = productColorKey(event.productId, event.color)
    next.colorSelections += 1
    next.byColorSelect[key] = (next.byColorSelect[key] || 0) + 1
  } else if (event.type === 'add_to_cart' && event.productId && event.color) {
    const key = productColorKey(event.productId, event.color)
    next.addToCart += 1
    next.byAddToCart[key] = (next.byAddToCart[key] || 0) + 1
  }

  return next
}

function isValidEvent(body) {
  if (!body || typeof body !== 'object') return false
  const { type, productId, color } = body
  if (type === 'visit' || type === 'page_view') return true
  if (type === 'product_click') return typeof productId === 'string' && productId.trim().length > 0
  if (type === 'color_select' || type === 'add_to_cart') {
    return (
      typeof productId === 'string' &&
      productId.trim().length > 0 &&
      typeof color === 'string' &&
      color.trim().length > 0
    )
  }
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
