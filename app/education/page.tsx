"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function EducationPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const knowledgeAreas = [
    {
      id: "diamonds",
      title: "Diamond Knowledge",
      subtitle: "Understanding Brilliance",
      description: "Discover the characteristics that make each diamond unique and how to identify exceptional quality",
      insights: ["The 4Cs: Cut, Color, Clarity, Carat", "How light creates brilliance", "Certification and authenticity", "Choosing the perfect stone"],
      href: "/education/diamonds"
    },
    {
      id: "metals",
      title: "Precious Metals",
      subtitle: "The Foundation of Fine Jewelry",
      description: "Learn about the noble metals that form the backbone of luxury jewelry",
      insights: ["18k Gold: purity and durability", "Platinum: the ultimate luxury", "White gold vs platinum differences", "Caring for precious metals"],
      href: "/education/metals"
    },
    {
      id: "settings",
      title: "Setting Artistry",
      subtitle: "How Your Stone is Secured",
      description: "Explore different setting styles and how they affect both beauty and practicality",
      insights: ["Classic prong settings", "Secure bezel mountings", "Elegant pavé work", "Choosing the right style"],
      href: "/education/settings"
    },
    {
      id: "care",
      title: "Jewelry Care",
      subtitle: "Preserving Your Investment",
      description: "Expert guidance on maintaining your jewelry's beauty and value for generations",
      insights: ["Daily wearing tips", "Professional maintenance", "Safe storage methods", "Insurance considerations"],
      href: "/education/care"
    }
  ];

  const quickFacts = [
    { label: "Diamond Hardness", value: "10 on Mohs Scale", iconType: "shield" },
    { label: "Gold Purity", value: "18k = 75% Pure", iconType: "award" },
    { label: "Platinum Rarity", value: "30x Rarer than Gold", iconType: "star" },
    { label: "Light Reflection", value: "Ideal Cut = 99.95%", iconType: "sparkles" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-elysium-ivory via-elysium-pearl to-elysium-champagne">
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-elysium-gold/5 via-transparent to-elysium-gold/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-elysium-gold/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-elysium-gold/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-elysium-obsidian tracking-[0.1em] mb-6">
            Knowledge
            <span className="block text-4xl md:text-5xl font-light text-elysium-gold mt-2">
              Center
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-elysium-charcoal font-light max-w-4xl mx-auto leading-relaxed">
            Discover the fascinating world of fine jewelry. Explore the craftsmanship, materials, and artistry that make each piece extraordinary.
          </p>
        </div>
      </section>

      {/* Quick Facts Strip */}
      <section className="py-12 bg-white/80 backdrop-blur-xl border-y border-elysium-whisper">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickFacts.map((fact, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 text-[#753600] group-hover:scale-110 group-hover:text-elysium-gold transition-all duration-300">
                  {fact.iconType === "shield" && (
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  )}
                  {fact.iconType === "award" && (
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                    </svg>
                  )}
                  {fact.iconType === "star" && (
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  )}
                  {fact.iconType === "sparkles" && (
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  )}
                </div>
                <div className="font-bold text-elysium-obsidian text-lg mb-1">
                  {fact.value}
                </div>
                <div className="text-sm text-elysium-charcoal font-light">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Areas */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-elysium-obsidian tracking-wide mb-4">
              Explore Our Expertise
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {knowledgeAreas.map((area, index) => (
              <div
                key={area.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(area.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >

                <div className="relative bg-white/90 backdrop-blur-xl p-8 border border-elysium-whisper shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-2xl">

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-[#753600] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {area.id === "diamonds" && (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                      )}
                      {area.id === "metals" && (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      )}
                      {area.id === "settings" && (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {area.id === "care" && (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-elysium-obsidian tracking-wide">
                        {area.title}
                      </h3>
                      <p className="text-elysium-gold font-medium text-sm">
                        {area.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-elysium-charcoal font-light leading-relaxed mb-6">
                    {area.description}
                  </p>

                  {/* Key Insights */}
                  <div className="space-y-3 mb-8">
                    {area.insights.map((insight, insightIndex) => (
                      <div key={insightIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-elysium-gold flex-shrink-0 mt-2"></div>
                        <span className="text-elysium-charcoal font-light">
                          {insight}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Link
                    href={area.href}
                    className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#753600] text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:bg-elysium-gold hover:text-[#753600] shadow-lg hover:shadow-xl"
                  >
                    Explore Knowledge
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Tools */}
      <section className="py-20 bg-white/50 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-elysium-obsidian tracking-wide mb-4">
              Discover & Compare
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-elysium-gold to-transparent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Diamond Guide",
                description: "Visual guide to understanding how the 4Cs affect diamond beauty and value",
                iconType: "search",
                action: "Explore Diamonds"
              },
              {
                title: "Size Reference",
                description: "See how different carat weights and ring sizes look in real life",
                iconType: "ruler",
                action: "View Sizes"
              },
              {
                title: "Style Finder",
                description: "Discover which jewelry styles complement your preferences and lifestyle",
                iconType: "sparkles",
                action: "Find Your Style"
              }
            ].map((tool, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl p-8 border border-elysium-whisper shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl text-center group">
                <div className="w-16 h-16 mx-auto mb-4 text-[#753600] group-hover:scale-110 group-hover:text-elysium-gold transition-all duration-300">
                  {tool.iconType === "search" && (
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  )}
                  {tool.iconType === "ruler" && (
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                  )}
                  {tool.iconType === "sparkles" && (
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-serif text-xl text-elysium-obsidian mb-3 tracking-wide">
                  {tool.title}
                </h3>
                <p className="text-elysium-charcoal font-light leading-relaxed mb-6">
                  {tool.description}
                </p>
                <button className="px-6 py-3 bg-elysium-gold text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:bg-[#753600] shadow-lg">
                  {tool.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultation CTA */}
      <section className="py-20 bg-[#753600]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl tracking-wide mb-6 text-white">
            Questions About Your Perfect Piece?
          </h2>
          <p className="text-xl font-light max-w-3xl mx-auto leading-relaxed mb-8 text-white">
            Our jewelry experts are here to help you navigate your choices and find the piece that's perfect for your needs and preferences.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/bespoke"
              className="px-8 py-4 bg-elysium-gold text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:bg-white hover:text-[#753600] shadow-xl"
            >
              Speak with an Expert
            </Link>
            <Link
              href="/shop"
              className="px-8 py-4 border-2 border-white text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:bg-white hover:text-[#753600]"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
