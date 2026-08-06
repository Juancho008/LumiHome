import { productImages } from '../data/products'

const categories = [
  {
    id: 'living',
    title: 'Living',
    image: productImages.mesaAuxiliar,
    cta: 'Ver más',
  },
  {
    id: 'iluminacion',
    title: 'Iluminación',
    image: productImages.lamparaMesa,
    cta: 'Ver más',
  },
  {
    id: 'mesas',
    title: 'Mesas auxiliares',
    image: productImages.lamparaMinimal,
    cta: 'Ver más',
  },
  {
    id: 'accesorios',
    title: 'Accesorios',
    image: productImages.tazasVidrio,
    cta: 'Ver más',
  },
]

export function CategoryBanners() {
  return (
    <section className="bg-cream pb-6 md:pb-10">
      <div className="mx-auto grid max-w-[1400px] gap-3 px-3 md:grid-cols-2 md:gap-4 md:px-4">
        {categories.map((category) => (
          <a
            key={category.id}
            id={category.id}
            href="#tienda"
            className="group relative block min-h-[280px] overflow-hidden md:min-h-[360px]"
          >
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />
            <div className="relative z-10 flex h-full min-h-[280px] flex-col items-center justify-center px-6 text-center text-white md:min-h-[360px]">
              <h2 className="font-serif text-3xl font-medium uppercase tracking-[0.1em] md:text-4xl">
                {category.title}
              </h2>
              <span className="mt-5 border border-white/80 px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
                {category.cta}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
