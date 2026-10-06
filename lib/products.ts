const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
export const asset = (p: string) => `${BASE}/${p.replace(/^\//, '')}`

/** A label in the four site languages. */
export type Entry = Record<'en' | 'uz' | 'ru' | 'ar', string>

export type Product = {
  id: number
  slug: string
  /** The variant name exactly as printed on the pack. */
  name: string
  /** Every claim here is read off the packaging or the brand's own artwork. */
  description: Entry
  /** The pack's own colour, for chrome that has to agree with it. */
  packagingColor: string
  images: {
    /** Front cutout, transparent background. */
    front: string
    /** Extra angles, when a faithful one exists. */
    extra?: string[]
  }
  /** Pods per pack, as marked on the pack. */
  quantity: number
  /** Indexes into COPY.site.benefits.items — the pack's three claims. */
  benefits: number[]
  /** Indexes into COPY.site.usage.steps. */
  usage: number[]
  /** Set once a real shop link exists; nothing renders while it is null. */
  purchaseUrl: string | null
  /** False keeps a line out of the catalogue until it is confirmed. */
  released: boolean
}

const t = (en: string, uz: string, ru: string, ar: string): Entry => ({ en, uz, ru, ar })

/**
 * The pack prints "REMOVES TOUGH STAINS & ODRS / EVEN IN COLD AND SHORT" and
 * the brand's own artwork renders the same line in Uzbek. Nothing beyond what
 * is printed goes in here: no origin, no certification, no percentages.
 */
const PACK_CLAIM = t(
  'Powerful against tough stains and odours — even on a cold, short cycle.',
  'Qiyin dog‘lar va hidlarga qarshi kuchli ta’sir — sovuq va qisqa dasturda ham.',
  'Сильное действие против стойких пятен и запахов — даже в холодной и короткой программе.',
  'فعّال ضد البقع والروائح العنيدة — حتى في دورة باردة وقصيرة.'
)

/**
 * One source of truth. A new line is one entry here; the gallery, the
 * catalogue and the product routes all read from this array.
 */
export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'amethyst',
    name: 'Amethyst',
    description: PACK_CLAIM,
    packagingColor: '#5B2150',
    images: { front: asset('products/amethyst.webp') },
    quantity: 60,
    benefits: [0, 1, 2],
    usage: [0, 1, 2],
    purchaseUrl: null,
    released: true
  },
  {
    id: 2,
    slug: 'crystal-bloom',
    name: 'Crystal Bloom',
    description: PACK_CLAIM,
    packagingColor: '#123E86',
    images: { front: asset('products/crystal.webp') },
    quantity: 60,
    benefits: [0, 1, 2],
    usage: [0, 1, 2],
    purchaseUrl: null,
    released: true
  },
  {
    id: 3,
    slug: 'original',
    name: 'Original',
    description: PACK_CLAIM,
    packagingColor: '#2E6B1F',
    images: { front: asset('products/original.webp') },
    quantity: 60,
    benefits: [0, 1, 2],
    usage: [0, 1, 2],
    purchaseUrl: null,
    released: true
  }
]

/** Everything the catalogue and the gallery show. */
export const RELEASED = PRODUCTS.filter((p) => p.released)

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug)
