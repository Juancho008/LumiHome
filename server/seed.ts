import type { Catalog } from '../src/types/catalog'

/** Seed with stable public URLs under /products/*.webp */
export function createSeedCatalog(): Catalog {
  return {
    banners: [
      {
        id: 'banner-1',
        title: 'Decoraciones para tu hogar',
        subtitle: 'Decora tu living a gusto, con piezas que inspiran.',
        cta: 'Ver más',
        image: '/products/mesa-auxiliar.webp',
      },
      {
        id: 'banner-2',
        title: 'Ambientes con estilo',
        subtitle: 'Iluminación y detalles para transformar cada rincón.',
        cta: 'Explorar',
        image: '/products/lampara-mesa.webp',
      },
      {
        id: 'banner-3',
        title: 'Tu espacio, tu esencia',
        subtitle: 'Accesorios elegantes para acompañar tu día a día.',
        cta: 'Descubrir',
        image: '/products/tazas-vidrio.webp',
      },
    ],
    categories: [
      {
        id: 'cat-living',
        title: 'Living',
        cta: 'Ver más',
        image: '/products/mesa-auxiliar.webp',
      },
      {
        id: 'cat-iluminacion',
        title: 'Iluminación',
        cta: 'Ver más',
        image: '/products/lampara-mesa.webp',
      },
      {
        id: 'cat-mesas',
        title: 'Mesas auxiliares',
        cta: 'Ver más',
        image: '/products/lampara-minimal.webp',
      },
      {
        id: 'cat-accesorios',
        title: 'Accesorios',
        cta: 'Ver más',
        image: '/products/tazas-vidrio.webp',
      },
    ],
    products: [
      {
        id: 'prod-mesa-auxiliar',
        name: 'Mesa auxiliar circular',
        price: '$189.000',
        description:
          'Mesa de arrime de dos niveles en madera y metal mate. Ideal para el living, junto al sofá o un sillón favorito.',
        categoryId: 'cat-mesas',
        colors: [
          { name: 'Nogal', hex: '#4A3728', image: '/products/mesa-auxiliar.webp' },
          { name: 'Roble', hex: '#A67C52', image: '/products/mesa-auxiliar.webp' },
          { name: 'Negro', hex: '#1A1A1A', image: '/products/mesa-auxiliar.webp' },
        ],
      },
      {
        id: 'prod-tazas-vidrio',
        name: 'Tazas de vidrio acanalado',
        price: '$42.000',
        description:
          'Set de tazas de vidrio con textura acanalada y asa cuadrada. Un detalle sofisticado para el desayuno o la sobremesa.',
        categoryId: 'cat-accesorios',
        colors: [
          { name: 'Transparente', hex: '#E8EEF2', image: '/products/tazas-vidrio.webp' },
          { name: 'Ámbar', hex: '#C47A3A', image: '/products/tazas-vidrio.webp' },
          { name: 'Humo', hex: '#8B9096', image: '/products/tazas-vidrio.webp' },
        ],
      },
      {
        id: 'prod-espumador',
        name: 'Espumador de café',
        price: '$78.000',
        description:
          'Jarra de vidrio con detalles en madera natural. Perfecta para preparar cafés cremosos y lucirla en la cocina.',
        categoryId: 'cat-accesorios',
        colors: [
          { name: 'Madera clara', hex: '#D4B896', image: '/products/espumador-cafe.webp' },
          { name: 'Madera oscura', hex: '#6B4E31', image: '/products/espumador-cafe.webp' },
        ],
      },
      {
        id: 'prod-taza-coffee',
        name: 'Taza Coffee de vidrio',
        price: '$28.000',
        description:
          'Taza de doble pared en vidrio, liviana y con presencia. Un accesorio diario que también decora la mesa.',
        categoryId: 'cat-accesorios',
        colors: [
          { name: 'Transparente', hex: '#EAF0F4', image: '/products/taza-coffee.webp' },
          { name: 'Ámbar', hex: '#C47A3A', image: '/products/taza-coffee.webp' },
        ],
      },
      {
        id: 'prod-lampara-mesa',
        name: 'Lámpara de mesa metal',
        price: '$156.000',
        description:
          'Lámpara de mesa con base metálica cepillada y pantalla cilíndrica. Luz cálida para living, escritorio o rincón de lectura.',
        categoryId: 'cat-iluminacion',
        colors: [
          { name: 'Níquel', hex: '#C0C0C0', image: '/products/lampara-mesa.webp' },
          { name: 'Negro mate', hex: '#2B2B2B', image: '/products/lampara-mesa.webp' },
          { name: 'Dorado', hex: '#C5A059', image: '/products/lampara-mesa.webp' },
        ],
      },
      {
        id: 'prod-lampara-minimal',
        name: 'Lámpara minimalista',
        price: '$134.000',
        description:
          'Lámpara de silueta fina y acabado mate. Un acento moderno para mesas auxiliares y espacios contemporáneos.',
        categoryId: 'cat-iluminacion',
        colors: [
          { name: 'Negro mate', hex: '#1F1F1F', image: '/products/lampara-minimal.webp' },
          { name: 'Blanco', hex: '#F4F1EB', image: '/products/lampara-minimal.webp' },
          { name: 'Arena', hex: '#C9B8A0', image: '/products/lampara-minimal.webp' },
        ],
      },
    ],
  }
}
