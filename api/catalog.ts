import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readCatalog } from '../server/catalog-store'
import { handleError, methodNotAllowed } from '../server/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  try {
    const catalog = await readCatalog()
    return res.status(200).json(catalog)
  } catch (err) {
    return handleError(res, err)
  }
}
