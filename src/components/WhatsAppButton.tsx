import { WhatsAppIcon } from './icons/SocialIcons'
import { whatsAppUrl } from '../lib/whatsapp'

export function WhatsAppButton() {
  return (
    <a
      href={whatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream shadow-[0_8px_32px_rgba(0,0,0,0.22)] ring-2 ring-gold/40 transition-all duration-300 hover:bg-gold hover:text-ink hover:ring-gold md:bottom-8 md:right-8"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
