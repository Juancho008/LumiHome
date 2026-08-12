import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { CatalogProduct } from '../../../server/types'
import { isAuthorized, readCatalog, writeCatalog } from '../../../server/catalog-store'
import {
  methodNotAllowed,
  nodeConfig,
  readJsonBody,
  unauthorized,
  wrap,
} from '../../../server/http'

export const config = nodeConfig

export default wrap(async (req: VercelRequest, res: VercelResponse) => {
  if (!isAuthorized(req.headers.authorization)) return unauthorized(res)

  const idParam = req.query.id
  const id = Array.isArray(idParam) ? idParam[0] : idParam
  if (!id) return res.status(400).json({ error: 'id inválido' })

  if (req.method === 'PUT') {
    const product = readJsonBody<CatalogProduct>(req)
    const catalog = await readCatalog()
    const index = catalog.products.findIndex((item) => item.id === id)
    if (index < 0) return res.status(404).json({ error: 'Producto no encontrado' })
    catalog.products[index] = { ...product, id }
    await writeCatalog(catalog)
    return res.status(200).json(catalog)
  }

  if (req.method === 'DELETE') {
    const catalog = await readCatalog()
    const next = catalog.products.filter((item) => item.id !== id)
    if (next.length === catalog.products.length) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    catalog.products = next
    await writeCatalog(catalog)
    return res.status(200).json(catalog)
  }

  return methodNotAllowed(res, ['PUT', 'DELETE'])
})
