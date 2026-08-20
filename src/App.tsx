import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { trackPageVisit } from './lib/track'
import { BenefitsBar } from './components/BenefitsBar'
import { CartDrawer } from './components/CartDrawer'
import { CategoryBanners } from './components/CategoryBanners'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProductGrid } from './components/ProductGrid'
import { ContactSection } from './components/ContactSection'
import { WhatsAppButton } from './components/WhatsAppButton'
import { CartProvider } from './context/CartContext'
import { CatalogProvider } from './context/CatalogContext'
import { ShopProvider } from './context/ShopContext'
import { SplashGate } from './components/SplashGate'
import { AdminPage } from './pages/AdminPage'

function Storefront() {
  useEffect(() => {
    trackPageVisit()
  }, [])

  return (
    <ShopProvider>
      <div className="min-h-svh bg-cream">
        <Header />
        <main>
          <Hero />
          <BenefitsBar />
          <CategoryBanners />
          <ProductGrid />
          <ContactSection />
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
      </div>
    </ShopProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <CartProvider>
          <SplashGate />
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
