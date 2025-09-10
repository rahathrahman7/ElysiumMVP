import Link from "next/link";

export function EditorialTeasers() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* New Collection */}
        <Link 
          href="/shop" 
          className="group relative overflow-hidden bg-gradient-to-br from-elysium-pearl to-white p-12 border border-elysium-whisper shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-elysium-gold rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-elysium-gold rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative z-10 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-elysium-gold to-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-elysium-obsidian tracking-wide mb-3">
                New Collection
              </h3>
              <p className="text-elysium-charcoal font-light leading-relaxed mb-6">
                Discover our latest designs, crafted with exceptional artistry and timeless elegance
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 text-elysium-gold font-medium tracking-wide uppercase text-sm group-hover:gap-3 transition-all duration-300">
              Explore Now
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Build Your Ring */}
        <Link 
          href="/bespoke" 
          className="group relative overflow-hidden bg-gradient-to-br from-white to-elysium-pearl p-12 border border-elysium-whisper shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-elysium-gold rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-elysium-gold rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          
          <div className="relative z-10 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-elysium-obsidian to-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-elysium-obsidian tracking-wide mb-3">
                Build Your Ring
              </h3>
              <p className="text-elysium-charcoal font-light leading-relaxed mb-6">
                Create a unique piece that reflects your vision with our bespoke design service
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 text-elysium-obsidian font-medium tracking-wide uppercase text-sm group-hover:gap-3 transition-all duration-300">
              Start Creating
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
