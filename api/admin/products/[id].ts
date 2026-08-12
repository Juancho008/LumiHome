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
  if (!isAuthorized(req.headers.authorization)) return unauthorized(res)

  const idParam = req.query.id
  const id = Array.isArray(idParam) ? idParam[0] : idParam
  if (!id) return res.status(400).json({ error: 'id inválido' })

  try {
    if (req.method === 'PUT') {
      const product = await readJsonBody<CatalogProduct>(req)
      const catalog = await readCatalog()
      const index = catalog.products.findIndex((p) => p.id === id)
      if (index < 0) return res.status(404).json({ error: 'Producto no encontrado' })
      catalog.products[index] = { ...product, id }
      await writeCatalog(catalog)
      return res.status(200).json(catalog)
    }

    if (req.method === 'DELETE') {
      const catalog = await readCatalog()
      const next = catalog.products.filter((p) => p.id !== id)
      if (next.length === catalog.products.length) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }
      catalog.products = next
      await writeCatalog(catalog)
      return res.status(200).json(catalog)
    }

    return methodNotAllowed(res, ['PUT', 'DELETE'])
  } catch (err) {
    return handleError(res, err)
  }
}
