import type { Catalog } from '../types/catalog'

const MIN_SPLASH_MS = 1400
const IMAGE_TIMEOUT_MS = 8000

export function collectPriorityImages(catalog: Catalog): string[] {
  const urls: string[] = []
  const seen = new Set<string>()

  const add = (src?: string) => {
    if (!src || seen.has(src)) return
    seen.add(src)
    urls.push(src)
  }

  for (const banner of catalog.banners) add(banner.image)
  for (const product of catalog.products.slice(0, 9)) add(product.colors[0]?.image)
  for (const category of catalog.categories.slice(0, 4)) add(category.image)

  return urls
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export async function waitForStorefront(catalog: Catalog, startedAt: number): Promise<void> {
  const images = collectPriorityImages(catalog)
  await Promise.race([
    Promise.all(images.map(preloadImage)),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, IMAGE_TIMEOUT_MS)
    }),
  ])

  const remaining = Math.max(0, MIN_SPLASH_MS - (Date.now() - startedAt))
  if (remaining > 0) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, remaining)
    })
  }
}
