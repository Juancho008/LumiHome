const BULLET = /^(?:➡️|➔|→|‣|▪|•|-|–|\*)\s*/

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function ProductDescription({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  const lines = splitLines(text)
  if (lines.length === 0) return null

  const bulletCount = lines.filter((line) => BULLET.test(line)).length
  const asList = lines.length > 1 && bulletCount >= Math.ceil(lines.length / 2)

  if (asList) {
    return (
      <ul className={`space-y-2.5 ${className}`}>
        {lines.map((line, index) => {
          const content = line.replace(BULLET, '').trim() || line
          return (
            <li key={`${index}-${content.slice(0, 24)}`} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[0.2em] text-[11px] leading-none text-gold">
                ➜
              </span>
              <span className="min-w-0">{content}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  return <p className={`whitespace-pre-line ${className}`}>{text.trim()}</p>
}
