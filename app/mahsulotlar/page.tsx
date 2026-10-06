import type { Metadata } from 'next'
import Catalogue from '@/components/site/Catalogue'

export const metadata: Metadata = {
  title: 'Mahsulotlar — BÄRC 3in1 PODS',
  description: 'BÄRC 3in1 PODS kir yuvish kapsulalari: Amethyst, Crystal Bloom va Original. Har qadoqda 60 dona.'
}

export default function ProductsPage() {
  return <Catalogue />
}
