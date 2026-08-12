import type { CartItem } from '../context/CartContext'
import { formatPrice } from './pricing'

export const WHATSAPP_NUMBER = '5493512089382'
export const WHATSAPP_DISPLAY = '+54 9 3512 08-9382'
export const INSTAGRAM_URL = 'https://www.instagram.com/lumihomesimply/'

export function whatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function buildOrderMessage(items: CartItem[], subtotal: number): string {
  const lines = items.map(
    (item) =>
      `• ${item.name} (${item.color}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
  )
  return [
    'Hola! Quiero consultar por estos productos:',
    '',
    ...lines,
    '',
    `Total: ${formatPrice(subtotal)}`,
  ].join('\n')
}

export function whatsAppOrderUrl(items: CartItem[], subtotal: number): string {
  return whatsAppUrl(buildOrderMessage(items, subtotal))
}
