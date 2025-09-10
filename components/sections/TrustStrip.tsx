import { HallmarkIcon, ReturnsIcon, ServiceIcon } from '@/components/icons/LuxuryIcons';

export function TrustStrip() {
  return (
    <section className="bg-gradient-to-b from-elysium-ivory to-elysium-pearl border-y border-elysium-whisper">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Hallmarked in London */}
          <div className="flex flex-col items-center gap-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-elysium-gold/20 to-elysium-gold/10 backdrop-blur-sm border border-elysium-gold/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-elysium-gold/20">
              <HallmarkIcon 
                size={32} 
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors duration-300" 
              />
            </div>
            <div>
              <h2 className="font-serif text-xl uppercase tracking-[0.15em] text-elysium-charcoal mb-2 leading-tight">
                Hallmarked in London
              </h2>
              <p className="text-sm text-elysium-smoke leading-relaxed font-light tracking-wide">
                Assay Office certified
              </p>
            </div>
          </div>
          
          {/* Free 30-day Returns */}
          <div className="flex flex-col items-center gap-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-elysium-gold/20 to-elysium-gold/10 backdrop-blur-sm border border-elysium-gold/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-elysium-gold/20">
              <ReturnsIcon 
                size={32} 
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors duration-300" 
              />
            </div>
            <div>
              <h2 className="font-serif text-xl uppercase tracking-[0.15em] text-elysium-charcoal mb-2 leading-tight">
                Free 30-day Returns
              </h2>
              <p className="text-sm text-elysium-smoke leading-relaxed font-light tracking-wide">
                No questions asked
              </p>
            </div>
          </div>
          
          {/* Complimentary Resizing */}
          <div className="flex flex-col items-center gap-6 group">
            <div className="w-16 h-16 bg-gradient-to-br from-elysium-gold/20 to-elysium-gold/10 backdrop-blur-sm border border-elysium-gold/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-elysium-gold/20">
              <ServiceIcon 
                size={32} 
                className="text-elysium-charcoal group-hover:text-elysium-gold transition-colors duration-300" 
              />
            </div>
            <div>
              <h2 className="font-serif text-xl uppercase tracking-[0.15em] text-elysium-charcoal mb-2 leading-tight">
                Complimentary Resizing
              </h2>
              <p className="text-sm text-elysium-smoke leading-relaxed font-light tracking-wide">
                Lifetime service
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


