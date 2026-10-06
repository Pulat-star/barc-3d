import type { Metadata } from 'next'
import { RELEASED, bySlug } from '@/lib/products'
import ProductView from '@/components/site/ProductView'

export function generateStaticParams() {
  return RELEASED.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = bySlug(params.slug)
  if (!p) return {}
  return {
    title: `BÄRC ${p.name} — 3in1 PODS kir yuvish kapsulalari`,
    description: `BÄRC ${p.name}: qadoqda ${p.quantity} dona 3in1 PODS. ${p.description.uz}`
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductView slug={params.slug} />
}
