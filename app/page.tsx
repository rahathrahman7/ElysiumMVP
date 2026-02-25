import LuxuryHero from '@/components/sections/LuxuryHero'

import Testimonials from '@/components/sections/Testimonials'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { CategoryShowcase } from '@/components/sections/CategoryShowcase'
import { Metadata } from 'next'
import { generateOrganizationJsonLd } from '@/lib/seo'

// Avoid prerender to prevent GSAP/ScrollTrigger initialization issues during static generation
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ELYSIUM — Luxury Engagement Rings & Fine Jewellery | London Atelier',
  description: 'Discover exquisite luxury engagement rings, wedding bands and fine jewellery crafted by master artisans in our London atelier. Bespoke designs in 18k gold, platinum with ethically sourced diamonds.',
  keywords: 'luxury engagement rings, fine jewellery London, bespoke engagement rings, diamond solitaire rings, wedding bands London, custom jewellery, 18k gold rings, platinum rings, London atelier',
  openGraph: {
    title: 'ELYSIUM — Luxury Engagement Rings & Fine Jewellery | London Atelier',
    description: 'Discover exquisite luxury engagement rings, wedding bands and fine jewellery crafted by master artisans in our London atelier.',
    type: 'website',
    siteName: 'ELYSIUM',
    images: [
      {
        url: '/products/nova-front.svg',
        width: 1200,
        height: 630,
        alt: 'ELYSIUM luxury engagement rings collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ELYSIUM — Luxury Engagement Rings & Fine Jewellery',
    description: 'Exquisite luxury jewellery crafted in our London atelier'
  }
}

export default async function HomePage() {
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main>
        <LuxuryHero />
        {/* Category Showcase - Replaces Product Grids */}
        <CategoryShowcase />

        {/* Trust Strip */}
        <div className="mt-24 md:mt-32">
          <TrustStrip />
        </div>

        {/* Testimonials Section */}
        <div className="mt-24 md:mt-32">
          <Testimonials />
        </div>
      </main>
    </>
  )
}
