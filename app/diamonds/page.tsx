import { redirect } from "next/navigation";
import { DiamondShapeIcon, diamondShapeIcons, type DiamondShape } from '@/components/icons/DiamondIcons';

const diamondInfo = [
  { shape: 'round' as DiamondShape, name: 'Round Brilliant', description: 'The most popular and brilliant cut, offering maximum sparkle and fire.' },
  { shape: 'oval' as DiamondShape, name: 'Oval', description: 'Elegant elongated shape that appears larger than round diamonds of similar carat weight.' },
  { shape: 'princess' as DiamondShape, name: 'Princess', description: 'Modern square cut with brilliant faceting for exceptional sparkle.' },
  { shape: 'pear' as DiamondShape, name: 'Pear', description: 'Unique teardrop shape combining round and marquise cuts.' },
  { shape: 'radiant' as DiamondShape, name: 'Radiant', description: 'Rectangular cut with brilliant faceting and cropped corners.' },
  { shape: 'emerald' as DiamondShape, name: 'Emerald', description: 'Step-cut rectangular shape emphasizing clarity and elegance.' },
  { shape: 'marquise' as DiamondShape, name: 'Marquise', description: 'Boat-shaped cut that maximizes apparent size and creates elegant proportions.' },
  { shape: 'heart' as DiamondShape, name: 'Heart', description: 'Symbol of love with distinctive romantic appeal.' },
  { shape: 'cushion' as DiamondShape, name: 'Cushion', description: 'Vintage-inspired cut with rounded corners and larger facets.' },
];

export default function DiamondsPage({ searchParams }: { searchParams: { shape?: string } }) {
  if (searchParams?.shape) {
    const shape = encodeURIComponent(searchParams.shape);
    redirect(`/shop?shape=${shape}`);
  }
  return (
    <div className="min-h-screen py-8 bg-elysium-ivory">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-[0.1em] text-elysium-charcoal mb-4">
            Diamond Shapes
          </h1>
          <p className="text-lg text-elysium-smoke max-w-2xl mx-auto leading-relaxed">
            Discover the perfect diamond shape to complement your ring design. 
            Each cut offers unique characteristics and beauty.
          </p>
        </div>

        {/* Diamond Shapes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {diamondInfo.map((diamond) => (
            <div
              key={diamond.shape}
              className="group bg-white/80 backdrop-blur-sm p-8 border border-elysium-whisper hover:border-elysium-gold/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                {/* Diamond Icon */}
                <div className="mb-6">
                  <DiamondShapeIcon
                    shape={diamond.shape}
                    size={64}
                    className="mx-auto text-elysium-charcoal group-hover:text-elysium-gold transition-colors duration-300"
                  />
                </div>

                {/* Diamond Name */}
                <h3 className="font-serif text-xl text-elysium-charcoal mb-3 group-hover:text-elysium-gold transition-colors">
                  {diamond.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-elysium-smoke leading-relaxed mb-6">
                  {diamond.description}
                </p>

                {/* CTA Button */}
                <a
                  href={`/diamonds?shape=${diamond.shape}`}
                  className="inline-block w-full text-center py-3 px-6 border border-elysium-gold text-elysium-charcoal hover:bg-elysium-gold hover:text-black transition-all duration-300"
                >
                  View {diamond.name} Diamonds
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Icon Showcase Section */}
        <div className="bg-white/50 backdrop-blur-sm p-8 border border-elysium-whisper mb-12">
          <h2 className="font-serif text-2xl text-elysium-charcoal text-center mb-8">
            Icon Variations
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {Object.entries(diamondShapeIcons).map(([shape, IconComponent]) => (
              <div key={shape} className="text-center">
                <div className="mb-3">
                  <IconComponent size={48} className="mx-auto text-elysium-charcoal hover:text-elysium-gold transition-colors cursor-pointer" />
                </div>
                <span className="text-xs text-elysium-smoke capitalize">{shape}</span>
              </div>
            ))}
          </div>

          {/* Size Examples */}
          <div className="mt-12 pt-8 border-t border-elysium-whisper">
            <h3 className="font-serif text-lg text-elysium-charcoal text-center mb-6">
              Size Examples
            </h3>
            <div className="flex justify-center items-end gap-8">
              <div className="text-center">
                <DiamondShapeIcon shape="round" size={16} className="mx-auto text-elysium-charcoal mb-2" />
                <span className="text-xs text-elysium-smoke">16px</span>
              </div>
              <div className="text-center">
                <DiamondShapeIcon shape="round" size={24} className="mx-auto text-elysium-charcoal mb-2" />
                <span className="text-xs text-elysium-smoke">24px</span>
              </div>
              <div className="text-center">
                <DiamondShapeIcon shape="round" size={32} className="mx-auto text-elysium-charcoal mb-2" />
                <span className="text-xs text-elysium-smoke">32px</span>
              </div>
              <div className="text-center">
                <DiamondShapeIcon shape="round" size={48} className="mx-auto text-elysium-charcoal mb-2" />
                <span className="text-xs text-elysium-smoke">48px</span>
              </div>
              <div className="text-center">
                <DiamondShapeIcon shape="round" size={64} className="mx-auto text-elysium-charcoal mb-2" />
                <span className="text-xs text-elysium-smoke">64px</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="font-serif text-3xl text-elysium-charcoal mb-4">
            Ready to Find Your Perfect Diamond?
          </h2>
          <p className="text-elysium-smoke mb-8 max-w-xl mx-auto">
            Browse our curated selection of certified diamonds or speak with our experts 
            to find the perfect stone for your ring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-elysium-gold to-amber-500 text-black font-medium tracking-wide hover:scale-105 transition-transform">
              Browse All Diamonds
            </button>
            <button className="px-8 py-3 border border-elysium-gold text-elysium-charcoal hover:bg-elysium-gold hover:text-black transition-all">
              Speak with Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
