import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAdminToken } from '../../server/catalog-store'
import { methodNotAllowed, nodeConfig, readJsonBody, unauthorized, wrap } from '../../server/http'

export const config = nodeConfig

export default wrap(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  const body = readJsonBody<{ token?: string }>(req)
  const token = (body.token || '').trim()
  const expected = getAdminToken()
  if (!expected || token !== expected) return unauthorized(res)
  return res.status(200).json({ ok: true })
})
