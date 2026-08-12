import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { CatalogBanner } from '../../src/types/catalog'
import { isAuthorized, readCatalog, writeCatalog } from '../../server/catalog-store'
import {
  handleError,
  methodNotAllowed,
  readJsonBody,
  unauthorized,
} from '../../server/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return methodNotAllowed(res, ['PUT'])
  if (!isAuthorized(req.headers.authorization)) return unauthorized(res)

  try {
    const body = await readJsonBody<{ banners: CatalogBanner[] }>(req)
    if (!Array.isArray(body.banners)) {
      return res.status(400).json({ error: 'banners inválido' })
    }
    const catalog = await readCatalog()
    catalog.banners = body.banners
    await writeCatalog(catalog)
    return res.status(200).json(catalog)
  } catch (err) {
    return handleError(res, err)
  }
}
