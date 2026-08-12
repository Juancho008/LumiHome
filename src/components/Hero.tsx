import { useEffect, useState } from 'react'
import { useCatalog } from '../context/CatalogContext'

export function Hero() {
  const { catalog } = useCatalog()
  const slides = catalog.banners
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
      setAnimKey((k) => k + 1)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) {
    return (
      <section id="inicio" className="flex h-[60vh] items-center justify-center bg-[#efece6]">
        <p className="text-[12px] uppercase tracking-[0.16em] text-muted">Sin banners</p>
      </section>
    )
  }

  const goTo = (index: number) => {
    setActive(index)
    setAnimKey((k) => k + 1)
  }

  const slide = slides[active] ?? slides[0]

  return (
    <section id="inicio" className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {slides.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== active}
        >
          {item.image ? (
            <img
              src={item.image}
              alt=""
              className={`h-full w-full object-cover object-center ${
                index === active ? 'animate-ken-burns' : ''
              }`}
            />
          ) : (
            <div className="h-full w-full bg-[#d8d4cd]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/35" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <div key={animKey} className="max-w-3xl">
          <h1 className="animate-fade-up font-serif text-[clamp(2.4rem,6vw,4.75rem)] font-medium uppercase leading-[0.95] tracking-[0.06em]">
            {slide.title}
          </h1>
          <p
            className="animate-fade-up mx-auto mt-5 max-w-xl text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 md:text-xs"
            style={{ animationDelay: '120ms' }}
          >
            {slide.subtitle}
          </p>
          <a
            href="#tienda"
            className="animate-fade-up mt-8 inline-flex items-center justify-center bg-ink px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:bg-gold hover:text-ink"
            style={{ animationDelay: '220ms' }}
          >
            {slide.cta}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Ir al slide ${index + 1}`}
            onClick={() => goTo(index)}
            className={`h-px transition-all duration-300 ${
              index === active ? 'w-10 bg-white' : 'w-6 bg-white/45 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
