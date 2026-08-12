import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { CatalogProduct } from '../../../src/types/catalog'
import { isAuthorized, readCatalog, writeCatalog } from '../../../server/catalog-store'
import {
  handleError,
  methodNotAllowed,
  readJsonBody,
  unauthorized,
} from '../../../server/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  if (!isAuthorized(req.headers.authorization)) return unauthorized(res)

  try {
    const product = await readJsonBody<CatalogProduct>(req)
    if (!product?.id || !product?.name || !Array.isArray(product.colors)) {
      return res.status(400).json({ error: 'producto inválido' })
    }
    const catalog = await readCatalog()
    if (catalog.products.some((p) => p.id === product.id)) {
      return res.status(409).json({ error: 'Ya existe un producto con ese id' })
    }
    catalog.products.push(product)
    await writeCatalog(catalog)
    return res.status(200).json(catalog)
  } catch (err) {
    return handleError(res, err)
  }
}
