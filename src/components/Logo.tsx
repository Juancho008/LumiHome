type LogoProps = {
  variant?: 'dark' | 'light'
  className?: string
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const ink = variant === 'light' ? '#FFFFFF' : '#111111'
  const muted = variant === 'light' ? 'rgba(255,255,255,0.75)' : '#111111'

  return (
    <div className={`inline-flex flex-col items-center leading-none ${className}`} aria-label="Lumi Home">
      <svg
        viewBox="0 0 220 70"
        className="h-auto w-[132px] md:w-[156px]"
        role="img"
        aria-hidden="true"
      >
        <text
          x="110"
          y="38"
          textAnchor="middle"
          fill={ink}
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="42"
          fontWeight="500"
          letterSpacing="0.08em"
        >
          LUMI
        </text>
        <line x1="48" y1="56" x2="78" y2="56" stroke={muted} strokeWidth="1" />
        <text
          x="110"
          y="60"
          textAnchor="middle"
          fill={muted}
          fontFamily="Montserrat, sans-serif"
          fontSize="11"
          fontWeight="400"
          letterSpacing="0.55em"
        >
          HOME
        </text>
        <line x1="142" y1="56" x2="172" y2="56" stroke={muted} strokeWidth="1" />
      </svg>
    </div>
  )
}
