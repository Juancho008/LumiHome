import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { CatalogBanner } from '../../server/types'
import { isAuthorized, readCatalog, writeCatalog } from '../../server/catalog-store'
import {
  methodNotAllowed,
  nodeConfig,
  readJsonBody,
  unauthorized,
  wrap,
} from '../../server/http'

export const config = nodeConfig

export default wrap(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'PUT') return methodNotAllowed(res, ['PUT'])
  if (!isAuthorized(req.headers.authorization)) return unauthorized(res)
  const body = readJsonBody<{ banners: CatalogBanner[] }>(req)
  if (!Array.isArray(body.banners)) {
    return res.status(400).json({ error: 'banners inválido' })
  }
  const catalog = await readCatalog()
  catalog.banners = body.banners
  await writeCatalog(catalog)
  return res.status(200).json(catalog)
})
