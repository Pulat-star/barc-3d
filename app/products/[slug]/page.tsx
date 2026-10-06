import { PRODUCTS } from '@/lib/products'
import ProductView from '@/components/site/ProductView'

/** Static export needs every product path up front. */
export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.available).map((p) => ({ slug: p.slug }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductView slug={params.slug} />
}
