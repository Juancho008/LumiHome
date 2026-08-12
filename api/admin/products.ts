import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { CatalogProduct } from '../../server/types'
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
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  if (!isAuthorized(req.headers.authorization)) return unauthorized(res)
  const product = readJsonBody<CatalogProduct>(req)
  if (!product?.id || !product?.name || !Array.isArray(product.colors)) {
    return res.status(400).json({ error: 'producto inválido' })
  }
  const catalog = await readCatalog()
  if (catalog.products.some((item) => item.id === product.id)) {
    return res.status(409).json({ error: 'Ya existe un producto con ese id' })
  }
  catalog.products.push(product)
  await writeCatalog(catalog)
  return res.status(200).json(catalog)
})
