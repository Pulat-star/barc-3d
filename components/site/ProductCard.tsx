'use client'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import { COPY, pick } from '@/lib/copy'
import { useLang } from '@/components/ui/LangContext'

/** The pack stands in an arch, its confirmed details beneath it. */
export default function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const { lang } = useLang()
  const site = COPY.site
  const scent = site.scent[product.slug]

  return (
    <Link
      href={`/mahsulotlar/${product.slug}/`}
      className="arch group flex flex-col items-center px-6 pb-8 pt-10 text-center"
      style={{ ['--d' as string]: `${delay}ms` }}
      data-rv
    >
      <div className="flex h-[240px] w-full items-end justify-center md:h-[300px]">
        <img
          src={product.images.front}
          alt={`BÄRC ${product.name} — 3in1 PODS kir yuvish kapsulalari`}
          width={664}
          height={900}
          className="depth h-full w-auto object-contain transition-transform duration-700 group-hover:-translate-y-2"
          style={{ maxWidth: 'none', transitionTimingFunction: 'var(--ease-mark)' }}
          loading="lazy"
        />
      </div>

      <h3 className="display mt-7 text-[clamp(1.6rem,3vw,2.1rem)]">{product.name}</h3>
      {scent && <p className="meta mt-2">{pick(scent, lang)}</p>}
      <p className="meta mt-1">{product.quantity} {pick(site.products.units, lang)}</p>

      <span className="btn btn-white mt-6">{pick(site.products.more, lang)}</span>
    </Link>
  )
}
