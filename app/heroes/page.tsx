"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HeroesPage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescriptionRef = useRef<HTMLDivElement>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    // Hero animations
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

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -20px 0px"
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-revealed");
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("animate-revealed");
      } else {
        fadeInObserver.observe(el);
      }
    });

    return () => {
      fadeInObserver.disconnect();
    };
  }, []);

  const services = [
    {
      name: "NHS",
      description: "Doctors, nurses, and all healthcare staff",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      )
    },
    {
      name: "Police",
      description: "Officers and civilian police staff",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    },
    {
      name: "Fire & Rescue",
      description: "Firefighters and rescue personnel",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      )
    },
    {
      name: "Paramedics",
      description: "Ambulance and emergency medical teams",
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Verify",
      description: "Show your Blue Light Card, service ID, or badge when you visit us or during your online consultation."
    },
    {
      number: "02",
      title: "Choose",
      description: "Browse our collection of engagement rings and wedding bands, or work with us to create something bespoke."
    },
    {
      number: "03",
      title: "Save",
      description: "Your 40% discount is applied automatically. No codes needed, no hidden fees."
    }
  ];

  const faqs = [
    {
      question: "What proof of service do I need?",
      answer: "We accept Blue Light Card, valid service ID, warrant card, or staff badge. If you don't have these, please contact us and we'll work with you to verify your eligibility."
    },
    {
      question: "Does the discount apply to bespoke designs?",
      answer: "Yes! The 40% discount applies to all engagement rings and wedding bands, including fully bespoke custom designs created just for you."
    },
    {
      question: "Can I combine this with other offers?",
      answer: "The Heroes discount cannot be combined with other promotional offers. However, it can be used alongside our interest-free payment plans."
    },
    {
      question: "How do I verify my eligibility online?",
      answer: "During your online consultation or checkout, our team will guide you through the verification process. You can upload a photo of your ID or verify via video call."
    },
    {
      question: "Is there a limit on the discount?",
      answer: "There's no maximum limit. Whether you're choosing a classic solitaire or a statement diamond piece, you'll receive the full 40% discount."
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <header className="relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="py-12 lg:py-20">
              <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium">
                40% Off for Emergency Services
              </span>
              <h1 
                ref={heroTitleRef}
                className="font-serif text-[#6D3D0D] mt-4 mb-6 transition-all duration-700 ease-out"
                style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', opacity: 0, transform: 'translateY(20px)'}}
              >
                Elysium for <span className="text-[#D4AF37]">Heroes</span>
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-16 bg-[#D4AF37]"></div>
                <div className="h-[2px] w-8 bg-[#D4AF37]/40"></div>
              </div>
              <div 
                ref={heroDescriptionRef}
                className="transition-all duration-700 ease-out delay-100"
                style={{opacity: 0, transform: 'translateY(20px)'}}
              >
                <p className="text-[#6D3D0D]/70 text-lg leading-relaxed mb-6 max-w-lg">
                  Your commitment to protecting our communities inspires us every day. 
                  This is our way of saying <strong className="text-[#6D3D0D]">thank you</strong> — with 
                  exclusive savings on the rings that mark your most precious moments.
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-[#6D3D0D]/60 mb-8">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Blue Light Card Accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No Hidden Fees</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/bespoke" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
                  >
                    Book Consultation
                  </Link>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D]"
                  >
                    Shop Collection
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src="/images/heroeshero.png"
                alt="Paramedic wearing an Elysium wedding ring while on duty"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        {/* Discount Highlight Section */}
        <section className="py-16 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 [&.animate-revealed]:opacity-100 [&.animate-revealed]:translate-y-0">
          <div className="bg-white border border-[#6D3D0D]/10 p-8 md:p-12 text-center">
            <div className="font-serif text-[#D4AF37] mb-4" style={{fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: 1}}>
              40%
            </div>
            <h2 className="font-serif text-[#6D3D0D] text-xl md:text-2xl mb-4" style={{letterSpacing: '-0.02em'}}>
              Off Engagement Rings & Wedding Bands
            </h2>
            <p className="text-[#6D3D0D]/60 max-w-md mx-auto">
              Exclusively for UK emergency services personnel. Your sacrifice deserves recognition.
            </p>
          </div>
        </section>

        {/* Eligible Services Grid */}
        <section className="pb-20 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 [&.animate-revealed]:opacity-100 [&.animate-revealed]:translate-y-0">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Who Qualifies</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Eligible <span className="text-[#D4AF37]">Services</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service.name}
                className="bg-white border border-[#6D3D0D]/10 p-6 text-center transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-lg group"
              >
                <div className="w-16 h-16 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/5">
                  {service.icon}
                </div>
                <h3 className="font-serif text-[#6D3D0D] text-lg mb-2">{service.name}</h3>
                <p className="text-[#6D3D0D]/60 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section with Background Image */}
        <section className="relative mb-20 -mx-6 md:-mx-12 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 [&.animate-revealed]:opacity-100 [&.animate-revealed]:translate-y-0">
          <div className="relative h-[500px] overflow-hidden">
            <Image
              src="/images/bouqetheroes.png"
              alt="NHS nurses and police officers celebrating at a wedding"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#6D3D0D]/80 via-[#6D3D0D]/60 to-transparent"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1000px] mx-auto px-6 md:px-12 w-full">
                <div className="max-w-lg">
                  <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium">Real Stories</span>
                  <h2 className="font-serif text-white text-3xl md:text-4xl mt-4 mb-6" style={{letterSpacing: '-0.02em'}}>
                    &ldquo;They protect us every day. We&apos;re honoured to be part of their love stories.&rdquo;
                  </h2>
                  <p className="text-white/80 leading-relaxed">
                    From NHS nurses to police officers, firefighters to paramedics — we&apos;ve had the privilege 
                    of crafting rings for thousands of heroes. Each piece carries the same dedication to 
                    excellence that you bring to your work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="pb-20 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 [&.animate-revealed]:opacity-100 [&.animate-revealed]:translate-y-0">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Simple Process</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              How It <span className="text-[#D4AF37]">Works</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white border border-[#6D3D0D]/10 p-8 h-full">
                  <div className="font-serif text-[#D4AF37] text-4xl mb-4">{step.number}</div>
                  <h3 className="font-serif text-[#6D3D0D] text-xl mb-3">{step.title}</h3>
                  <p className="text-[#6D3D0D]/60 text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-[#D4AF37]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-20 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 [&.animate-revealed]:opacity-100 [&.animate-revealed]:translate-y-0">
          <div className="text-center mb-12">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Common Questions</span>
            <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3" style={{letterSpacing: '-0.02em'}}>
              Frequently Asked <span className="text-[#D4AF37]">Questions</span>
            </h2>
          </div>
          
          <div className="bg-white border border-[#6D3D0D]/10 divide-y divide-[#6D3D0D]/10">
            {faqs.map((faq, index) => (
              <div key={index} className="overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors"
                >
                  <h3 className="font-medium text-[#6D3D0D]">{faq.question}</h3>
                  <svg 
                    className={`w-5 h-5 text-[#D4AF37] flex-shrink-0 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${expandedFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="px-6 pb-6 text-[#6D3D0D]/70 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 border-t border-[#6D3D0D]/10">
          <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Start Today</span>
          <h2 className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-3 mb-4" style={{letterSpacing: '-0.02em'}}>
            Ready to Claim Your <span className="text-[#D4AF37]">Hero Discount</span>?
          </h2>
          <p className="text-[#6D3D0D]/60 mb-8 max-w-xl mx-auto">
            Whether you&apos;re ready to browse or prefer a personal consultation, 
            we&apos;re here to help you find the perfect ring.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link 
              href="/bespoke" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
            >
              Book Consultation
            </Link>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#6D3D0D]/30 text-[#6D3D0D] font-light tracking-wider uppercase text-sm transition-all duration-300 hover:border-[#6D3D0D]"
            >
              Shop Collection
            </Link>
          </div>
          <p className="text-[#6D3D0D]/40 text-xs max-w-lg mx-auto">
            *Discount applies to engagement rings and wedding bands only. Valid proof of service required. 
            Cannot be combined with other promotional offers. Elysium reserves the right to verify eligibility.
          </p>
        </section>
      </div>
    </main>
  );
}
