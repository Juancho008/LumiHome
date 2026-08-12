import { useCatalog } from '../context/CatalogContext'
import {
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  whatsAppUrl,
} from '../lib/whatsapp'
import { InstagramIcon, WhatsAppIcon } from './icons/SocialIcons'

export function ContactSection() {
  const { catalog } = useCatalog()
  const email = catalog.contact?.email?.trim() ?? ''

  return (
    <section id="contacto" className="scroll-mt-28 bg-ink text-cream">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24 md:px-8">
        <div className="text-center md:text-left">
          <p className="font-serif text-2xl uppercase tracking-[0.12em] md:text-3xl">Contacto</p>
          <p className="mt-6 text-[15px] leading-relaxed text-cream/85 md:text-base">
            Lumi Home nació de la pasión por los detalles que transforman un espacio. Somos un
            emprendimiento de decoración para el hogar: elegimos cada pieza con calma, buscando que
            tu casa refleje calidez y personalidad. No vendemos solo objetos; curamos ambientes donde
            te gusta estar, acompañándote con la misma dedicación que pondrías al decorar tu propio
            hogar.
          </p>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-8 inline-flex border border-cream/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              {email}
            </a>
          ) : null}
        </div>

        <div>
          <div className="overflow-hidden bg-[#2a2a2a]">
            <img
              src="/products/lampara-mesa.webp"
              alt="Hogar decorado con piezas Lumi Home"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
            <a
              href={whatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-cream px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
