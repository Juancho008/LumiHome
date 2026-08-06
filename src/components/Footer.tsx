export function Footer() {
  return (
    <footer className="border-t border-line bg-[#f3f1ec] text-ink">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-3 md:px-8 md:py-16">
        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.12em]">Sobre nosotros</h3>
          <ul className="mt-5 space-y-2.5 text-[13px] text-muted">
            <li>
              <a href="#inicio" className="transition-colors hover:text-ink">
                Nuestra historia
              </a>
            </li>
            <li>
              <a href="#inicio" className="transition-colors hover:text-ink">
                FAQ
              </a>
            </li>
            <li>
              <a href="#inicio" className="transition-colors hover:text-ink">
                Cambios y devoluciones
              </a>
            </li>
            <li>
              <a href="#contacto" className="transition-colors hover:text-ink">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.12em]">Información</h3>
          <ul className="mt-5 space-y-2.5 text-[13px] text-muted">
            <li>
              <a href="#inicio" className="transition-colors hover:text-ink">
                Medios de pago
              </a>
            </li>
            <li>
              <a href="#tienda" className="transition-colors hover:text-ink">
                Tienda
              </a>
            </li>
            <li>
              <a href="#inicio" className="transition-colors hover:text-ink">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href="#inicio" className="transition-colors hover:text-ink">
                Políticas de privacidad
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg uppercase tracking-[0.12em]">Newsletter</h3>
          <p className="mt-5 text-[13px] leading-relaxed text-muted">
            Suscribite para recibir novedades, lanzamientos y beneficios exclusivos.
          </p>
          <form
            className="mt-5 flex border border-line bg-cream"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Tu email"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted/70"
            />
            <button
              type="submit"
              className="bg-ink px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-gold hover:text-ink"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-line px-6 py-5 text-center text-[11px] tracking-[0.08em] text-muted">
        © {new Date().getFullYear()} Lumi Home. Todos los derechos reservados.
      </div>
    </footer>
  )
}
