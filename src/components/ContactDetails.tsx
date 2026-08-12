import { useCatalog } from '../context/CatalogContext'

function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '')
  return cleaned ? `tel:${cleaned}` : ''
}

export function ContactDetails({ variant }: { variant: 'section' | 'footer' }) {
  const { catalog } = useCatalog()
  const email = catalog.contact?.email?.trim() ?? ''
  const phone = catalog.contact?.phone?.trim() ?? ''
  const phoneLink = telHref(phone)

  if (!email && !phone) return null

  if (variant === 'footer') {
    return (
      <ul className="mt-5 space-y-2.5 text-[13px] text-muted">
        {email ? (
          <li>
            <a href={`mailto:${email}`} className="transition-colors hover:text-ink">
              {email}
            </a>
          </li>
        ) : null}
        {phone ? (
          <li>
            {phoneLink ? (
              <a href={phoneLink} className="transition-colors hover:text-ink">
                {phone}
              </a>
            ) : (
              phone
            )}
          </li>
        ) : null}
      </ul>
    )
  }

  return (
    <div className="mt-7 flex flex-col items-center gap-3">
      {email ? (
        <a
          href={`mailto:${email}`}
          className="inline-flex bg-cream px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
        >
          {email}
        </a>
      ) : null}
      {phone ? (
        phoneLink ? (
          <a
            href={phoneLink}
            className="inline-flex border border-cream/40 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:border-gold hover:text-gold"
          >
            {phone}
          </a>
        ) : (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream/80">{phone}</p>
        )
      ) : null}
    </div>
  )
}
