import type { VercelRequest, VercelResponse } from '@vercel/node'

export function methodNotAllowed(res: VercelResponse, allow: string[]) {
  res.setHeader('Allow', allow.join(', '))
  return res.status(405).json({ error: 'Método no permitido' })
}

export function unauthorized(res: VercelResponse) {
  return res.status(401).json({ error: 'No autorizado' })
}

export function handleError(res: VercelResponse, err: unknown) {
  const message = err instanceof Error ? err.message : 'Error interno'
  const statusCode =
    err && typeof err === 'object' && 'statusCode' in err
      ? Number((err as { statusCode?: number }).statusCode) || 500
      : 500
  return res.status(statusCode).json({ error: message })
}

export async function readJsonBody<T>(req: VercelRequest): Promise<T> {
  if (req.body && typeof req.body === 'object') {
    return req.body as T
  }
  if (typeof req.body === 'string' && req.body) {
    return JSON.parse(req.body) as T
  }
  return {} as T
}
