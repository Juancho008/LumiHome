import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { CatalogCategory } from '../../server/types'
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
  const body = readJsonBody<{ categories: CatalogCategory[] }>(req)
  if (!Array.isArray(body.categories)) {
    return res.status(400).json({ error: 'categories inválido' })
  }
  const catalog = await readCatalog()
  catalog.categories = body.categories
  await writeCatalog(catalog)
  return res.status(200).json(catalog)
})
