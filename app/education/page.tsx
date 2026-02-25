"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// FAQ Schema Data for SEO
const faqSchemaData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the 4Cs of diamonds?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 4Cs of diamonds are Cut, Color, Clarity, and Carat Weight. Cut determines how well a diamond reflects light, Color measures the absence of color (D being colorless), Clarity grades internal inclusions and blemishes, and Carat Weight measures the diamond's size. Cut is considered the most important factor for brilliance."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best diamond clarity grade?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "FL (Flawless) and IF (Internally Flawless) are the highest clarity grades, but VS1-VS2 (Very Slightly Included) offers excellent value as inclusions are not visible to the naked eye. For most buyers, VS2 or SI1 clarity provides the best balance of quality and value."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between 18k gold and platinum?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "18k gold is 75% pure gold mixed with alloys for durability and comes in yellow, white, and rose colors. Platinum is 95% pure, naturally white, hypoallergenic, and 30 times rarer than gold. Platinum is denser and more durable but costs more. Both are excellent choices for fine jewelry."
      }
    },
    {
      "@type": "Question",
      "name": "How do I clean diamond jewelry at home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Clean diamond jewelry at home by soaking in warm water with mild dish soap for 20-30 minutes, then gently brushing with a soft toothbrush. Rinse thoroughly and dry with a lint-free cloth. Avoid harsh chemicals, ultrasonic cleaners for fragile settings, and remove jewelry before swimming or using cleaning products."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best diamond cut for brilliance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Round Brilliant cut is considered the best for maximum brilliance and fire, with 58 facets optimized for light performance. An 'Excellent' or 'Ideal' cut grade ensures 99.95% light reflection. Other brilliant cuts like Oval, Princess, and Cushion also offer excellent sparkle."
      }
    },
    {
      "@type": "Question",
      "name": "What does GIA certified mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GIA (Gemological Institute of America) certification means a diamond has been independently graded by the world's most respected gemological laboratory. GIA provides unbiased assessments of the 4Cs, ensuring you know exactly what you're buying. Always request GIA certification for diamonds over 0.5 carats."
      }
    }
  ]
};

// Quick navigation items
const quickNavItems = [
  { id: "diamond-guide", label: "Diamond Guide" },
  { id: "metal-guide", label: "Metal Guide" },
  { id: "setting-guide", label: "Settings" },
  { id: "care-guide", label: "Care Guide" },
  { id: "faqs", label: "FAQs" },
];

// Knowledge area data
const knowledgeAreas = [
  {
    id: "diamond-guide",
    title: "Diamond",
    subtitle: "Knowledge",
    tagline: "Understanding the 4Cs: Cut, Color, Clarity & Carat",
    description: "Master the art of diamond selection. Learn how cut quality affects brilliance, why color grading matters, what clarity grades mean, and how carat weight impacts value. Our comprehensive guide covers everything from GIA certification to choosing the perfect stone.",
    image: "/education/diamondscard.png",
    alt: "GIA certified round brilliant diamond showing exceptional cut quality and light performance",
    href: "/education/diamonds",
    cta: "Learn Diamond Grading",
    highlights: ["4Cs Explained", "GIA Certification", "Cut Quality Guide", "Value Tips"],
    reverse: false
  },
  {
    id: "metal-guide",
    title: "Precious",
    subtitle: "Metals",
    tagline: "18k Gold vs Platinum: Complete Comparison",
    description: "Discover the characteristics of 18k yellow gold, white gold, rose gold, and platinum. Understand purity levels, durability, hypoallergenic properties, and how to choose the right metal for your lifestyle and skin tone.",
    image: "/education/metalscard.png",
    alt: "18k yellow gold, white gold, rose gold and platinum jewelry metals comparison",
    href: "/education/metals",
    cta: "Compare Metals",
    highlights: ["Gold Purity Guide", "Platinum Benefits", "Color Comparison", "Durability"],
    reverse: true
  },
  {
    id: "setting-guide",
    title: "Setting",
    subtitle: "Artistry",
    tagline: "Prong, Bezel, Pavé & Halo Settings Explained",
    description: "Explore ring setting styles from classic 4-prong solitaires to intricate pavé halos. Learn how different settings affect security, light performance, and the overall aesthetic of your piece.",
    image: "/education/settingscard.png",
    alt: "Platinum prong setting detail showing secure diamond mounting craftsmanship",
    href: "/education/settings",
    cta: "Explore Settings",
    highlights: ["Prong Settings", "Bezel Security", "Pavé Technique", "Halo Designs"],
    reverse: false
  },
  {
    id: "care-guide",
    title: "Jewellery",
    subtitle: "Care",
    tagline: "How to Clean & Maintain Fine Jewelry",
    description: "Expert tips on cleaning diamond rings at home, storing precious pieces safely, and knowing when to seek professional maintenance. Protect your investment and keep your jewelry sparkling for generations.",
    image: "/education/carecard.png",
    alt: "Professional jewelry cleaning tools and microfiber cloth for diamond ring care",
    href: "/education/care",
    cta: "Care Instructions",
    highlights: ["Home Cleaning", "Safe Storage", "Professional Care", "Daily Tips"],
    reverse: true
  }
];

// FAQ data
const faqs = [
  {
    question: "What are the 4Cs of diamonds?",
    answer: "The 4Cs are Cut, Color, Clarity, and Carat Weight—the universal standard for assessing diamond quality. Cut determines brilliance (how well light reflects), Color grades the absence of color (D is colorless, Z has visible yellow), Clarity measures inclusions (FL is flawless, I3 has visible inclusions), and Carat Weight measures size. Of these, Cut has the greatest impact on a diamond's beauty."
  },
  {
    question: "What is the best diamond clarity grade to buy?",
    answer: "For the best value, VS1-VS2 (Very Slightly Included) offers an 'eye-clean' appearance where inclusions aren't visible without magnification. SI1 can also be eye-clean in many diamonds. FL/IF grades command premium prices but offer no visible difference to the naked eye. Focus your budget on cut quality first, then balance clarity with color."
  },
  {
    question: "What's the difference between 18k gold and platinum?",
    answer: "18k gold is 75% pure gold with 25% alloys for strength, available in yellow, white, and rose colors. Platinum is 95% pure, naturally white, hypoallergenic, and 30x rarer than gold. Platinum is denser and more durable but develops a patina over time. Both are excellent for fine jewelry—choose based on color preference, skin sensitivity, and budget."
  },
  {
    question: "How do I clean my diamond ring at home?",
    answer: "Soak your ring in warm water with a few drops of mild dish soap for 20-30 minutes. Gently brush with a soft toothbrush, paying attention to the underside where oils collect. Rinse thoroughly under warm running water and dry with a lint-free cloth. Clean every 1-2 weeks for optimal sparkle. Avoid harsh chemicals and remove before swimming."
  },
  {
    question: "What diamond cut has the most sparkle?",
    answer: "The Round Brilliant cut offers maximum brilliance with 58 precisely angled facets designed to reflect 99.95% of light. Look for 'Excellent' or 'Ideal' cut grades for the best light performance. Oval, Princess, and Cushion cuts also offer excellent sparkle. Emerald and Asscher cuts have fewer facets but showcase clarity with elegant 'hall of mirrors' reflections."
  },
  {
    question: "What does GIA certified mean?",
    answer: "GIA (Gemological Institute of America) certification means your diamond has been independently evaluated by the world's most trusted gemological laboratory. GIA reports provide unbiased grading of the 4Cs, fluorescence, and measurements. This certification protects your investment by ensuring you know exactly what you're purchasing. We recommend GIA certification for all diamonds over 0.5 carats."
  }
];

export default function EducationPage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescriptionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeNav, setActiveNav] = useState<string>("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    // Animate hero elements on mount
    if (heroTitleRef.current) {
      setTimeout(() => {
        heroTitleRef.current?.setAttribute('style', 'opacity:1;transform:translateY(0);');
      }, 100);
    }
    if (heroDescriptionRef.current) {
      setTimeout(() => {
        heroDescriptionRef.current?.setAttribute('style', 'opacity:1;transform:translateY(0);');
      }, 200);
    }
    if (statsRef.current) {
      setTimeout(() => {
        statsRef.current?.setAttribute('style', 'opacity:1;transform:translateY(0);');
      }, 300);
    }

    // Intersection observer for active navigation
    const observerOptions = {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    }, observerOptions);

    quickNavItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* FAQ Schema for SEO */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />

      <main className="min-h-screen bg-[#FAF7F2]">
        {/* Breadcrumb with Schema */}
        <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16 pt-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-[#6D3D0D]/60" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" itemProp="item" className="hover:text-[#D4AF37] transition-colors">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span className="text-[#6D3D0D] font-medium" itemProp="name" aria-current="page">Diamond &amp; Jewelry Education</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>
        </div>

        {/* ========== HERO SECTION - SEO Optimized ========== */}
        <header className="relative">
          <div className="max-w-[1900px] mx-auto px-0">
            <div className="relative grid lg:grid-cols-2 items-center min-h-[600px] lg:min-h-[700px]">
              {/* Text Content */}
              <div className="relative z-20 px-6 md:px-12 lg:px-16 py-16 lg:py-24">
                <div className="relative max-w-2xl">
                  <div className="mb-6">
                    <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Diamond &amp; Jewelry Education</span>
                  </div>
                  <h1 
                    ref={heroTitleRef}
                    className="font-serif text-[#6D3D0D] leading-[0.85] mb-8"
                    style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    <span className="block font-light" style={{fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.02em'}}>Learn About</span>
                    <span className="block font-semibold text-[#D4AF37]" style={{fontSize: 'clamp(3rem, 8vw, 6.5rem)', letterSpacing: '-0.04em'}}>Diamonds</span>
                    <span className="block font-light" style={{fontSize: 'clamp(1.5rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>&amp; Fine Jewellery</span>
                  </h1>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-[2px] w-20 bg-[#D4AF37]"></div>
                    <div className="h-[2px] w-12 bg-[#D4AF37]/40"></div>
                  </div>
                  <div 
                    ref={heroDescriptionRef}
                    className="mb-10"
                    style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 800ms cubic-bezier(0.4, 0, 0.2, 1) 200ms' }}
                  >
                    <p className="text-[#6D3D0D] font-light italic leading-relaxed mb-6" style={{fontSize: 'clamp(1.05rem, 2vw, 1.35rem)', letterSpacing: '0.01em'}}>
                      Your complete guide to the 4Cs, precious metals, and jewelry care
                    </p>
                    <p className="text-[#6D3D0D]/75 font-light leading-[1.75] max-w-lg" style={{fontSize: 'clamp(1rem, 1.8vw, 1.2rem)'}}>
                      Make confident, informed decisions with our expert guides on <strong>diamond clarity</strong>, <strong>cut quality</strong>, <strong>18k gold vs platinum</strong>, and how to care for your precious pieces.
                    </p>
                  </div>
                  
                  {/* Quick Stats for SEO */}
                  <div className="flex flex-wrap gap-6 text-sm text-[#6D3D0D]/70">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>GIA Certified Experts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>25+ Years Experience</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative h-[560px] md:h-[620px] lg:h-[680px]">
                <Image
                  src="/education/educationhero.png"
                  alt="GIA certified diamond ring with expert jewelry education and 4Cs grading guide"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  quality={75}
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </header>

        {/* ========== QUICK NAVIGATION - Sticky ========== */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-y border-[#6D3D0D]/10 shadow-sm" aria-label="Quick navigation">
          <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-center gap-2 md:gap-4 py-4 overflow-x-auto scrollbar-hide">
              {quickNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-5 py-2.5 text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap border ${
                    activeNav === item.id
                      ? "bg-[#6D3D0D] text-white border-[#6D3D0D]"
                      : "bg-transparent text-[#6D3D0D] border-[#6D3D0D]/20 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ========== QUICK FACTS STRIP - Elegant Design ========== */}
        <section 
          ref={statsRef}
          className="relative py-16 lg:py-20 bg-white border-y border-[#6D3D0D]/10"
          style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 300ms, transform 800ms cubic-bezier(0.4, 0, 0.2, 1) 300ms' }}
          aria-label="Diamond and jewelry quick facts"
        >
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
            <h2 className="sr-only">Diamond and Jewelry Quick Facts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              <div className="text-center p-6 border-r border-[#6D3D0D]/10 last:border-r-0">
                <div className="font-serif text-[#D4AF37] text-3xl md:text-4xl font-semibold mb-2">10</div>
                <div className="text-[#6D3D0D] text-sm font-medium uppercase tracking-wider mb-1">Mohs Scale</div>
                <div className="text-[#6D3D0D]/50 text-xs">Diamond Hardness</div>
              </div>
              <div className="text-center p-6 border-r border-[#6D3D0D]/10 last:border-r-0">
                <div className="font-serif text-[#D4AF37] text-3xl md:text-4xl font-semibold mb-2">75%</div>
                <div className="text-[#6D3D0D] text-sm font-medium uppercase tracking-wider mb-1">Pure Gold</div>
                <div className="text-[#6D3D0D]/50 text-xs">18k Gold Content</div>
              </div>
              <div className="text-center p-6 border-r border-[#6D3D0D]/10 last:border-r-0">
                <div className="font-serif text-[#D4AF37] text-3xl md:text-4xl font-semibold mb-2">30×</div>
                <div className="text-[#6D3D0D] text-sm font-medium uppercase tracking-wider mb-1">Rarer Than Gold</div>
                <div className="text-[#6D3D0D]/50 text-xs">Platinum Rarity</div>
              </div>
              <div className="text-center p-6">
                <div className="font-serif text-[#D4AF37] text-3xl md:text-4xl font-semibold mb-2">99.95%</div>
                <div className="text-[#6D3D0D] text-sm font-medium uppercase tracking-wider mb-1">Light Return</div>
                <div className="text-[#6D3D0D]/50 text-xs">Ideal Cut Performance</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== KNOWLEDGE AREAS - Enhanced with SEO ========== */}
        <section className="py-16 lg:py-24" aria-labelledby="knowledge-areas-heading">
          <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="text-center mb-16">
              <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Comprehensive Guides</span>
              <h2 id="knowledge-areas-heading" className="font-serif text-[#6D3D0D] mt-4 mb-4" style={{fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>
                Expert <span className="text-[#D4AF37]">Knowledge</span> Areas
              </h2>
              <p className="text-[#6D3D0D]/70 font-light max-w-2xl mx-auto">
                In-depth guides written by GIA-certified gemologists to help you make informed decisions about diamonds, precious metals, and jewelry care.
              </p>
            </div>
          </div>

          <div className="space-y-0">
            {knowledgeAreas.map((area, index) => (
              <article 
                key={area.id} 
                id={area.id}
                className="relative scroll-mt-20"
              >
                <div className="max-w-[1900px] mx-auto px-0">
                  <div className={`relative grid lg:grid-cols-12 items-center gap-6 lg:gap-10 ${area.reverse ? '' : ''}`}>
                    {/* Image */}
                    <div className={`relative h-[400px] md:h-[500px] lg:h-[560px] ${area.reverse ? 'lg:order-1' : 'lg:order-none'} lg:col-span-7`}>
                      <Link className="group block relative h-full overflow-hidden" href={area.href}>
                        <Image
                          src={area.image}
                          alt={area.alt}
                          fill
                          className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#6D3D0D]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent" aria-hidden="true"></div>
                      </Link>
                    </div>
                    
                    {/* Content */}
                    <div className={`relative z-20 px-6 md:px-12 lg:px-12 xl:px-14 py-12 lg:py-16 ${area.reverse ? 'lg:order-2' : ''} lg:col-span-5`}>
                      <div className="relative">
                        <h3 className="font-serif text-[#6D3D0D] leading-[0.9] mb-4">
                          <span className="block font-light" style={{fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>{area.title}</span>
                          <span className="block font-semibold text-[#D4AF37]" style={{fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em'}}>{area.subtitle}</span>
                        </h3>
                        <p className="text-[#D4AF37] text-sm uppercase tracking-wider font-medium mb-4">{area.tagline}</p>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
                          <div className="h-[2px] w-6 bg-[#D4AF37]/40"></div>
                        </div>
                        <p className="text-[#6D3D0D]/75 font-light leading-[1.8] mb-6" style={{fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)'}}>
                          {area.description}
                        </p>
                        
                        {/* Highlights/Topics */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {area.highlights.map((highlight) => (
                            <span 
                              key={highlight}
                              className="px-3 py-1 bg-[#D4AF37]/10 text-[#6D3D0D] text-xs font-medium rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <Link 
                          className="inline-flex items-center gap-4 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-[0.15em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 group relative overflow-hidden" 
                          href={area.href}
                        >
                          <span className="relative z-10">{area.cta}</span>
                          <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                          </svg>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Divider between sections */}
                {index < knowledgeAreas.length - 1 && (
                  <div className="py-8 lg:py-12">
                    <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16">
                      <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45"></div>
                        <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ========== FAQ SECTION - Critical for SEO ========== */}
        <section id="faqs" className="py-20 lg:py-28 bg-white scroll-mt-20" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Common Questions</span>
              <h2 id="faq-heading" className="font-serif text-[#6D3D0D] mt-4 mb-4" style={{fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>
                Frequently Asked <span className="text-[#D4AF37]">Questions</span>
              </h2>
              <p className="text-[#6D3D0D]/70 font-light max-w-xl mx-auto">
                Expert answers to the most common questions about diamonds, gold, platinum, and jewelry care.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="border border-[#6D3D0D]/10 bg-[#FAF7F2] overflow-hidden transition-all duration-300 hover:border-[#D4AF37]/30"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:ring-inset"
                    aria-expanded={expandedFaq === index}
                  >
                    <h3 className="font-serif text-[#6D3D0D] pr-4" style={{fontSize: 'clamp(1rem, 1.8vw, 1.2rem)'}}>
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-[#6D3D0D]/75 font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SHOP CTA - Internal Linking ========== */}
        <section className="py-20 lg:py-28 bg-[#FAF7F2]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Shop with Confidence</span>
                <h2 className="font-serif text-[#6D3D0D] mt-4 mb-6" style={{fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>
                  Ready to Find Your <span className="text-[#D4AF37]">Perfect Piece</span>?
                </h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[2px] w-12 bg-[#D4AF37]"></div>
                  <div className="h-[2px] w-6 bg-[#D4AF37]/40"></div>
                </div>
                <p className="text-[#6D3D0D]/75 font-light leading-relaxed mb-8 max-w-lg">
                  Now that you understand diamond quality and precious metals, explore our collection of GIA-certified diamonds and handcrafted jewelry.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/shop?category=engagement-rings"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37] hover:gap-4"
                  >
                    <span>Shop Engagement Rings</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link 
                    href="/shop"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D] hover:bg-[#6D3D0D]/5"
                  >
                    <span>Browse All Collections</span>
                  </Link>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center transition-all duration-300 hover:border-[#D4AF37]/30">
                  <div className="w-10 h-10 mx-auto mb-3 border border-[#D4AF37]/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-[#6D3D0D] font-medium text-sm mb-1">GIA Certified</h3>
                  <p className="text-[#6D3D0D]/50 text-xs">All diamonds certified</p>
                </div>
                <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center transition-all duration-300 hover:border-[#D4AF37]/30">
                  <div className="w-10 h-10 mx-auto mb-3 border border-[#D4AF37]/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <h3 className="text-[#6D3D0D] font-medium text-sm mb-1">Free Shipping</h3>
                  <p className="text-[#6D3D0D]/50 text-xs">Insured delivery</p>
                </div>
                <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center transition-all duration-300 hover:border-[#D4AF37]/30">
                  <div className="w-10 h-10 mx-auto mb-3 border border-[#D4AF37]/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                  <h3 className="text-[#6D3D0D] font-medium text-sm mb-1">30-Day Returns</h3>
                  <p className="text-[#6D3D0D]/50 text-xs">Risk-free purchase</p>
                </div>
                <div className="bg-white border border-[#6D3D0D]/10 p-6 text-center transition-all duration-300 hover:border-[#D4AF37]/30">
                  <div className="w-10 h-10 mx-auto mb-3 border border-[#D4AF37]/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <h3 className="text-[#6D3D0D] font-medium text-sm mb-1">Lifetime Service</h3>
                  <p className="text-[#6D3D0D]/50 text-xs">Free cleaning and care</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== EXPERT CTA ========== */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Personal Guidance</span>
            <h2 className="font-serif text-[#6D3D0D] mt-4 mb-6 leading-[0.95]">
              <span className="block font-light" style={{fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>Still Have Questions?</span>
              <span className="block font-semibold text-[#D4AF37]" style={{fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em'}}>Ask an Expert</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[2px] w-16 bg-[#D4AF37]"></div>
              <div className="h-[2px] w-8 bg-[#D4AF37]/40"></div>
            </div>
            <p className="text-[#6D3D0D]/75 font-light leading-[1.8] mb-10 max-w-2xl mx-auto" style={{fontSize: 'clamp(1rem, 1.8vw, 1.2rem)'}}>
              Our GIA-certified gemologists are here to help you understand diamond quality, compare options, and find the perfect piece for your budget and preferences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-[#6D3D0D] text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 group relative overflow-hidden" href="/bespoke">
                <span className="relative z-10">Book Free Consultation</span>
                <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
