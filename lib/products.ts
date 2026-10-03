const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
export const asset = (p: string) => `${BASE}/${p.replace(/^\//, '')}`

export type Product = {
  slug: string
  /** Shown as the product's own name. */
  name: string
  /** Category — the brand is organised by these, not by a single hero SKU. */
  category: 'pods' | 'powder' | 'gel' | 'stain'
  image: string
  /** Accent used for glow and chrome while this product leads the chain. */
  tint: string
  available: boolean
}

/**
 * The brand is a system, not one product. Adding a new line means adding an
 * entry here — the hero cluster, the scroll chain and the catalogue all read
 * from this array and size themselves to its length.
 */
export const PRODUCTS: Product[] = [
  { slug: 'amethyst', name: 'Amethyst',      category: 'pods',   image: asset('products/amethyst.webp'), tint: '#8E3FB0', available: true },
  { slug: 'crystal',  name: 'Crystal Bloom', category: 'pods',   image: asset('products/crystal.webp'),  tint: '#2F7BEA', available: true },
  { slug: 'original', name: 'Original',      category: 'pods',   image: asset('products/original.webp'), tint: '#2E9E4F', available: true },
  { slug: 'powder',   name: 'Powder',        category: 'powder', image: asset('products/powder.webp'),   tint: '#E8358A', available: false },
  { slug: 'gel',      name: 'Gel',           category: 'gel',    image: asset('products/gel.webp'),      tint: '#E8358A', available: false },
  { slug: 'stain',    name: 'Stain Remover', category: 'stain',  image: asset('products/spray.webp'),    tint: '#E8358A', available: false }
]

export const SCENES = {
  shirtDirty: asset('scenes/shirt-dirty.webp'),
  shirtClean: asset('scenes/shirt-clean.webp')
}
