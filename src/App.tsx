import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BenefitsBar } from './components/BenefitsBar'
import { CartDrawer } from './components/CartDrawer'
import { CategoryBanners } from './components/CategoryBanners'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProductGrid } from './components/ProductGrid'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import { AdminPage } from './pages/AdminPage'

function Storefront() {
  return (
    <div className="min-h-svh bg-cream">
      <Header />
      <main>
        <Hero />
        <BenefitsBar />
        <ProductGrid />
        <CategoryBanners />
        <section id="contacto" className="scroll-mt-28 bg-ink px-6 py-14 text-center text-cream md:py-16">
          <p className="font-serif text-2xl uppercase tracking-[0.12em] md:text-3xl">Contacto</p>
          <p className="mx-auto mt-3 max-w-lg text-[12px] uppercase tracking-[0.16em] text-cream/70">
            Escribinos para consultas sobre productos y disponibilidad.
          </p>
          <a
            href="mailto:hola@lumihome.com"
            className="mt-7 inline-flex bg-cream px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
          >
            hola@lumihome.com
          </a>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </CartProvider>
      </CatalogProvider>
    </BrowserRouter>
  )
}

export default App
