const benefits = [
  {
    title: 'Diseño exclusivo',
    text: 'Piezas seleccionadas para elevar cada ambiente de tu hogar.',
  },
  {
    title: 'Piezas de calidad',
    text: 'Acabados cuidados y materiales pensados para durar.',
  },
  {
    title: 'Estilo atemporal',
    text: 'Decoración con carácter para acompañar tu hogar.',
  },
]

export function BenefitsBar() {
  return (
    <section className="border-b border-line bg-cream">
      <div className="mx-auto grid max-w-[1200px] divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {benefits.map((item) => (
          <article key={item.title} className="px-6 py-8 text-center md:px-8 md:py-10">
            <h2 className="font-serif text-xl font-medium uppercase tracking-[0.08em] text-ink md:text-[1.35rem]">
              {item.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-[12px] leading-relaxed tracking-[0.02em] text-muted">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
