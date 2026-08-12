import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAdminToken } from '../../server/catalog-store'
import { handleError, methodNotAllowed, readJsonBody, unauthorized } from '../../server/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])
  try {
    const body = await readJsonBody<{ token?: string }>(req)
    const token = (body.token || '').trim()
    const expected = getAdminToken()
    if (!expected || token !== expected) return unauthorized(res)
    return res.status(200).json({ ok: true })
  } catch (err) {
    return handleError(res, err)
  }
}
