import mesaAuxiliar from '../assets/products/mesa-auxiliar.webp'
import tazasVidrio from '../assets/products/tazas-vidrio.webp'
import espumadorCafe from '../assets/products/espumador-cafe.webp'
import tazaCoffee from '../assets/products/taza-coffee.webp'
import lamparaMesa from '../assets/products/lampara-mesa.webp'
import lamparaMinimal from '../assets/products/lampara-minimal.webp'
import type { Product } from '../components/ProductModal'

export const products: Product[] = [
  {
    name: 'Mesa auxiliar circular',
    price: '$189.000',
    image: mesaAuxiliar,
    description:
      'Mesa de arrime de dos niveles en madera y metal mate. Ideal para el living, junto al sofá o un sillón favorito.',
    colors: [
      { name: 'Nogal', hex: '#4A3728' },
      { name: 'Roble', hex: '#A67C52' },
      { name: 'Negro', hex: '#1A1A1A' },
    ],
  },
  {
    name: 'Tazas de vidrio acanalado',
    price: '$42.000',
    image: tazasVidrio,
    description:
      'Set de tazas de vidrio con textura acanalada y asa cuadrada. Un detalle sofisticado para el desayuno o la sobremesa.',
    colors: [
      { name: 'Transparente', hex: '#E8EEF2' },
      { name: 'Ámbar', hex: '#C47A3A' },
      { name: 'Humo', hex: '#8B9096' },
    ],
  },
  {
    name: 'Espumador de café',
    price: '$78.000',
    image: espumadorCafe,
    description:
      'Jarra de vidrio con detalles en madera natural. Perfecta para preparar cafés cremosos y lucirla en la cocina.',
    colors: [
      { name: 'Madera clara', hex: '#D4B896' },
      { name: 'Madera oscura', hex: '#6B4E31' },
    ],
  },
  {
    name: 'Taza Coffee de vidrio',
    price: '$28.000',
    image: tazaCoffee,
    description:
      'Taza de doble pared en vidrio, liviana y con presencia. Un accesorio diario que también decora la mesa.',
    colors: [
      { name: 'Transparente', hex: '#EAF0F4' },
      { name: 'Ámbar', hex: '#C47A3A' },
    ],
  },
  {
    name: 'Lámpara de mesa metal',
    price: '$156.000',
    image: lamparaMesa,
    description:
      'Lámpara de mesa con base metálica cepillada y pantalla cilíndrica. Luz cálida para living, escritorio o rincón de lectura.',
    colors: [
      { name: 'Níquel', hex: '#C0C0C0' },
      { name: 'Negro mate', hex: '#2B2B2B' },
      { name: 'Dorado', hex: '#C5A059' },
    ],
  },
  {
    name: 'Lámpara minimalista',
    price: '$134.000',
    image: lamparaMinimal,
    description:
      'Lámpara de silueta fina y acabado mate. Un acento moderno para mesas auxiliares y espacios contemporáneos.',
    colors: [
      { name: 'Negro mate', hex: '#1F1F1F' },
      { name: 'Blanco', hex: '#F4F1EB' },
      { name: 'Arena', hex: '#C9B8A0' },
    ],
  },
]

export const productImages = {
  mesaAuxiliar,
  tazasVidrio,
  espumadorCafe,
  tazaCoffee,
  lamparaMesa,
  lamparaMinimal,
}
