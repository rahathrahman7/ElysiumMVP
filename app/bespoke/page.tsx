import { BespokeForm } from "@/components/BespokeForm";
import Image from "next/image";

export default function BespokePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-elysium-ivory to-elysium-pearl">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-elysium-gold/5 via-transparent to-elysium-gold/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-elysium-gold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-elysium-gold/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-elysium-obsidian tracking-[0.1em] mb-6">
            Bespoke
            <span className="block text-4xl md:text-5xl font-light text-elysium-gold mt-2">
              Craftsmanship
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-elysium-charcoal font-light max-w-3xl mx-auto leading-relaxed">
            Transform your vision into an extraordinary piece of jewelry, meticulously crafted by our master artisans in our London atelier
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white/50 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-elysium-obsidian tracking-wide mb-4">
              Your Journey to Perfection
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-20">
            {[
              {
                step: "01",
                title: "Initial Consultation",
                description: "Share your vision with our design specialists through a personal consultation",
                icon: "💎"
              },
              {
                step: "02", 
                title: "Design Development",
                description: "Our artisans create detailed sketches and 3D renderings of your unique piece",
                icon: "✏️"
              },
              {
                step: "03",
                title: "Material Selection", 
                description: "Choose from ethically sourced diamonds and precious metals of the highest quality",
                icon: "🔍"
              },
              {
                step: "04",
                title: "Master Craftsmanship",
                description: "Your piece is meticulously handcrafted by our skilled artisans in London",
                icon: "⚒️"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-elysium-gold to-amber-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-elysium-obsidian text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-serif text-xl text-elysium-obsidian mb-3 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-elysium-charcoal font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Form Section */}
            <div className="order-2 lg:order-1">
              <div className="bg-white/80 backdrop-blur-xl p-10 border border-elysium-whisper shadow-2xl">
                <div className="mb-8">
                  <h2 className="font-serif text-3xl text-elysium-obsidian mb-4 tracking-wide">
                    Begin Your Journey
                  </h2>
                  <p className="text-elysium-charcoal font-light leading-relaxed">
                    Share your vision with us. Our master craftsmen will bring your dream piece to life with unparalleled artistry and attention to detail.
                  </p>
                </div>
                <BespokeForm />
              </div>
            </div>

            {/* Content Section */}
            <div className="order-1 lg:order-2 space-y-12">
              
              {/* Expertise Card */}
              <div className="bg-gradient-to-br from-elysium-pearl to-white p-8 border border-elysium-whisper shadow-xl">
                <h3 className="font-serif text-2xl text-elysium-obsidian mb-4 tracking-wide">
                  Uncompromising Excellence
                </h3>
                <div className="space-y-4 text-elysium-charcoal">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-elysium-gold mt-3 flex-shrink-0"></div>
                    <p className="font-light">Master artisans with over 25 years of experience</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-elysium-gold mt-3 flex-shrink-0"></div>
                    <p className="font-light">Ethically sourced diamonds with GIA certification</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-elysium-gold mt-3 flex-shrink-0"></div>
                    <p className="font-light">Hallmarked precious metals from certified suppliers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-elysium-gold mt-3 flex-shrink-0"></div>
                    <p className="font-light">Lifetime service and complimentary maintenance</p>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-gradient-to-br from-white to-elysium-pearl p-8 border border-elysium-whisper shadow-xl">
                <h3 className="font-serif text-2xl text-elysium-obsidian mb-6 tracking-wide">
                  What to Expect
                </h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="text-elysium-gold font-bold text-lg">24hrs</div>
                    <div>
                      <p className="font-medium text-elysium-obsidian">Initial Response</p>
                      <p className="text-sm text-elysium-charcoal font-light">Personal consultation booking confirmation</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-elysium-gold font-bold text-lg">1-2wks</div>
                    <div>
                      <p className="font-medium text-elysium-obsidian">Design Phase</p>
                      <p className="text-sm text-elysium-charcoal font-light">Detailed sketches and 3D renderings</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-elysium-gold font-bold text-lg">6-8wks</div>
                    <div>
                      <p className="font-medium text-elysium-obsidian">Craftsmanship</p>
                      <p className="text-sm text-elysium-charcoal font-light">Meticulous handcrafting and finishing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Booking */}
              <div className="bg-gradient-to-r from-elysium-gold/10 to-amber-500/10 p-8 border border-elysium-gold/20 shadow-xl">
                <h3 className="font-serif text-2xl text-elysium-obsidian mb-4 tracking-wide">
                  Book a Personal Consultation
                </h3>
                <p className="text-elysium-charcoal font-light mb-6 leading-relaxed">
                  Meet with our design specialists at our London showroom or schedule a virtual consultation from the comfort of your home.
                </p>
                <div className="bg-white/80 backdrop-blur-sm p-6 border border-elysium-whisper shadow-lg">
                  <div className="text-center text-elysium-charcoal">
                    <div className="text-4xl mb-4">📅</div>
                    <p className="font-medium mb-2">Consultation Booking</p>
                    <p className="text-sm font-light">Schedule your appointment with our design team</p>
                    <button className="mt-4 px-6 py-3 bg-gradient-to-r from-elysium-gold to-amber-500 text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:scale-105 shadow-lg">
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/30 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-elysium-obsidian tracking-wide mb-4">
              Treasured Stories
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "The entire bespoke process was magical. From the initial consultation to the final reveal, every detail was perfect. Our engagement ring exceeded every expectation.",
                author: "Charlotte & James",
                location: "London"
              },
              {
                quote: "Working with ELYSIUM to create my mother's heirloom redesign was an emotional journey. They honored the legacy while creating something uniquely beautiful.",
                author: "Sarah M.",
                location: "Edinburgh"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl p-8 border border-elysium-whisper shadow-xl">
                <div className="text-4xl text-elysium-gold mb-4">"</div>
                <p className="text-elysium-charcoal font-light leading-relaxed mb-6 italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-elysium-gold to-amber-500"></div>
                  <div>
                    <p className="font-medium text-elysium-obsidian">{testimonial.author}</p>
                    <p className="text-sm text-elysium-charcoal font-light">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}


