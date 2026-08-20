const BULLET_MARKER = /(?:➡️|➔|→|‣|▪|•)/
const BULLET_SPLIT = /\s*(?:➡️|➔|→|‣|▪|•)\s*/

function parseDescription(text: string): { intro: string; items: string[] } {
  const trimmed = text.trim()
  if (!trimmed) return { intro: '', items: [] }

  if (!BULLET_MARKER.test(trimmed)) {
    return { intro: trimmed, items: [] }
  }

  const parts = trimmed
    .split(BULLET_SPLIT)
    .map((part) => part.trim())
    .filter(Boolean)

  const startsWithBullet = BULLET_MARKER.test(trimmed.slice(0, 4))

  if (startsWithBullet) {
    return { intro: '', items: parts }
  }

  return {
    intro: parts[0] ?? '',
    items: parts.slice(1),
  }
}

export function ProductDescription({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const { intro, items } = parseDescription(text)
  if (!intro && items.length === 0) return null

  if (items.length === 0) {
    return <p className={`whitespace-pre-line ${className}`}>{intro}</p>
  }

  return (
    <div className={className}>
      {intro ? <p className="mb-3 whitespace-pre-line">{intro}</p> : null}
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={`${index}-${item.slice(0, 24)}`} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-[0.2em] shrink-0 text-[11px] leading-none text-gold">
              ➜
            </span>
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
