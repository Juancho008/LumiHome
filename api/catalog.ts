import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readCatalog } from '../server/catalog-store'
import { methodNotAllowed, nodeConfig, wrap } from '../server/http'

export const config = nodeConfig

export default wrap(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])
  const catalog = await readCatalog()
  return res.status(200).json(catalog)
})
