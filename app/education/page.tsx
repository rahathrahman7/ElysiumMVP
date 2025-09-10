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
      icon: "💎",
      gradient: "from-blue-500/20 to-purple-500/20",
      insights: ["The 4Cs: Cut, Color, Clarity, Carat", "How light creates brilliance", "Certification and authenticity", "Choosing the perfect stone"],
      href: "/education/diamonds"
    },
    {
      id: "metals",
      title: "Precious Metals",
      subtitle: "The Foundation of Fine Jewelry",
      description: "Learn about the noble metals that form the backbone of luxury jewelry",
      icon: "🥇",
      gradient: "from-yellow-500/20 to-orange-500/20",
      insights: ["18k Gold: purity and durability", "Platinum: the ultimate luxury", "White gold vs platinum differences", "Caring for precious metals"],
      href: "/education/metals"
    },
    {
      id: "settings",
      title: "Setting Artistry",
      subtitle: "How Your Stone is Secured",
      description: "Explore different setting styles and how they affect both beauty and practicality",
      icon: "💍",
      gradient: "from-pink-500/20 to-red-500/20",
      insights: ["Classic prong settings", "Secure bezel mountings", "Elegant pavé work", "Choosing the right style"],
      href: "/education/settings"
    },
    {
      id: "care",
      title: "Jewelry Care",
      subtitle: "Preserving Your Investment",
      description: "Expert guidance on maintaining your jewelry's beauty and value for generations",
      icon: "✨",
      gradient: "from-green-500/20 to-teal-500/20",
      insights: ["Daily wearing tips", "Professional maintenance", "Safe storage methods", "Insurance considerations"],
      href: "/education/care"
    }
  ];

  const quickFacts = [
    { label: "Diamond Hardness", value: "10 on Mohs Scale", icon: "💪" },
    { label: "Gold Purity", value: "18k = 75% Pure", icon: "🎯" },
    { label: "Platinum Rarity", value: "30x Rarer than Gold", icon: "🏆" },
    { label: "Light Reflection", value: "Ideal Cut = 99.95%", icon: "✨" }
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
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {fact.icon}
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
                <div className={`bg-gradient-to-br ${area.gradient} absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                  hoveredCard === area.id ? "opacity-100" : "opacity-0"
                }`} />
                
                <div className="relative bg-white/90 backdrop-blur-xl p-8 border border-elysium-whisper shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-2xl">
                  
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-elysium-gold to-amber-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {area.id === "diamonds" ? (
                        <Image
                          src="/images/diamondicon1.png"
                          alt="Diamond"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-3xl">{area.icon}</span>
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
                    className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-elysium-obsidian to-gray-800 text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
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
                icon: "🔍",
                action: "Explore Diamonds"
              },
              {
                title: "Size Reference",
                description: "See how different carat weights and ring sizes look in real life",
                icon: "📏",
                action: "View Sizes"
              },
              {
                title: "Style Finder",
                description: "Discover which jewelry styles complement your preferences and lifestyle",
                icon: "✨",
                action: "Find Your Style"
              }
            ].map((tool, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl p-8 border border-elysium-whisper shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl text-center group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="font-serif text-xl text-elysium-obsidian mb-3 tracking-wide">
                  {tool.title}
                </h3>
                <p className="text-elysium-charcoal font-light leading-relaxed mb-6">
                  {tool.description}
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-elysium-gold to-amber-500 text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:scale-105 shadow-lg">
                  {tool.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultation CTA */}
      <section className="py-20 bg-gradient-to-r from-elysium-obsidian to-gray-800">
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
              className="px-8 py-4 bg-gradient-to-r from-elysium-gold to-amber-500 text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Speak with an Expert
            </Link>
            <Link 
              href="/shop" 
              className="px-8 py-4 border-2 border-white text-white font-medium tracking-wide uppercase text-sm transition-all duration-300 hover:bg-white/10 hover:border-white"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
