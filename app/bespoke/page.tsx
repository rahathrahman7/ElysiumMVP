"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BespokeForm } from "@/components/BespokeForm";

export default function BespokePage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescriptionRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLElement>(null);
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  // Scroll to form function for CTA
  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

    // Observe all animated elements and immediately reveal those already in viewport
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      // Check if element is already in viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("animate-revealed");
      } else {
        fadeInObserver.observe(el);
      }
    });

    // Process step animation on scroll
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.getAttribute("data-step") || "0");
          setActiveProcessStep(stepIndex);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll(".process-step").forEach((el) => {
      processObserver.observe(el);
    });

    return () => {
      fadeInObserver.disconnect();
      processObserver.disconnect();
    };
  }, []);

  const processSteps = [
    {
      number: "01",
      title: "Consultation",
      description: "Share your vision during an intimate consultation with our design specialists. We listen to your story, understand your desires, and begin translating dreams into reality.",
      image: "/images/BespokeDesign.png"
    },
    {
      number: "02", 
      title: "Design",
      description: "Our master artisans create detailed sketches and photorealistic 3D renderings, refining every curve and facet until perfection is achieved.",
      image: "/images/BespokeDesign.png"
    },
    {
      number: "03",
      title: "Selection",
      description: "Hand-select your stones from our collection of ethically sourced, GIA-certified diamonds. Each gem is chosen for its exceptional quality and character.",
      image: "/images/BespokeDesign.png"
    },
    {
      number: "04",
      title: "Craftsmanship",
      description: "Watch your vision come to life as our London artisans meticulously handcraft your piece with techniques perfected over generations.",
      image: "/images/BespokeDesign.png"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Breadcrumb */}
      <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16 pt-8">
        <Breadcrumb />
      </div>

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1900px] mx-auto px-0">
          <div className="relative grid lg:grid-cols-12 items-center min-h-[600px] lg:min-h-[750px]">
            {/* Text Content */}
            <div className="relative z-20 px-6 md:px-12 lg:px-16 py-16 lg:py-24 lg:col-span-5">
              <div className="relative max-w-2xl">
                <div className="mb-6">
                  <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Bespoke Service</span>
                </div>
                <h1
                  ref={heroTitleRef}
                  className="font-serif text-[#6D3D0D] leading-[0.85] mb-8"
                  style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <span className="block font-light" style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em'}}>Your Story,</span>
                  <span className="block font-semibold text-[#D4AF37]" style={{fontSize: 'clamp(3.5rem, 8vw, 7rem)', letterSpacing: '-0.04em'}}>Set in Stone</span>
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
                    One-of-one. Just like you.
                  </p>
                  <p className="text-[#6D3D0D]/75 font-light leading-[1.75] mb-8" style={{fontSize: 'clamp(1rem, 1.8vw, 1.2rem)'}}>
                    From the first spark of inspiration to the final polish, our master artisans transform your unique vision into an heirloom that tells your story for generations.
                  </p>
                  {/* Hero CTA */}
                  <button
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-4 px-10 py-5 bg-[#6D3D0D] text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 group relative overflow-hidden"
                  >
                    <span className="relative z-10">Begin Your Journey</span>
                    <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Image with Parallax Effect */}
            <div className="relative h-[560px] md:h-[620px] lg:h-[750px] lg:col-span-7 overflow-hidden">
              <div className="absolute inset-0 transform hover:scale-105 transition-transform duration-1000">
                <Image
                  src="/images/BespokeDesign.png"
                  alt="Master artisan crafting a bespoke piece"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  quality={75}
                  priority
                />
              </div>
              {/* Overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#FAF7F2]/30 lg:to-[#FAF7F2]/60"></div>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROCESS SECTION - Enhanced with Timeline ========== */}
      <section className="relative py-24 lg:py-32 bg-white" ref={processRef}>
        <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16">
          {/* Section Header */}
          <div className="text-center mb-20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">The Journey</span>
            <h2 className="font-serif text-[#6D3D0D] mt-4 mb-6" style={{fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>
              How We <span className="text-[#D4AF37]">Create</span>
            </h2>
            <p className="text-[#6D3D0D]/70 font-light max-w-2xl mx-auto" style={{fontSize: 'clamp(1rem, 1.6vw, 1.15rem)'}}>
              Every bespoke piece follows a meticulous journey from concept to creation, guided by your vision and our expertise.
            </p>
          </div>

          {/* Timeline Process Steps */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37]/40 to-[#D4AF37]/20 transform -translate-x-1/2"></div>
            
            <div className="space-y-16 lg:space-y-0">
              {processSteps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`process-step animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-${index * 100}`}
                  data-step={index}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Image Side */}
                    <div className={`relative mb-8 lg:mb-0 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className="relative aspect-[4/3] overflow-hidden group">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#6D3D0D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    
                    {/* Content Side */}
                    <div className={`relative ${index % 2 === 1 ? 'lg:order-1 lg:text-right' : ''}`}>
                      {/* Step Number Badge */}
                      <div className={`flex items-center gap-4 mb-6 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                        <div className="relative">
                          <div className={`w-16 h-16 bg-gradient-to-br from-[#6D3D0D] to-[#8B5A3C] rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 ${activeProcessStep === index ? 'scale-110 ring-4 ring-[#D4AF37]/30' : ''}`}>
                            <span className="text-[#D4AF37] font-serif text-xl font-semibold">{step.number}</span>
                          </div>
                          {/* Pulse effect for active step */}
                          {activeProcessStep === index && (
                            <div className="absolute inset-0 w-16 h-16 bg-[#D4AF37]/20 rounded-full animate-ping"></div>
                          )}
                        </div>
                        <div className="h-[2px] w-12 bg-[#D4AF37]/40 hidden sm:block"></div>
                      </div>
                      
                      <h3 className="font-serif text-[#6D3D0D] mb-4" style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.01em'}}>
                        {step.title}
                      </h3>
                      <p className="text-[#6D3D0D]/70 font-light leading-relaxed" style={{fontSize: 'clamp(1rem, 1.6vw, 1.1rem)'}}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Divider between steps (except last) */}
                  {index < processSteps.length - 1 && (
                    <div className="flex items-center justify-center gap-4 my-16 lg:my-24">
                      <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
                      <div className="w-2 h-2 bg-[#D4AF37] rotate-45"></div>
                      <div className="h-[1px] flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What to Expect Timeline - Moved here from Info Section */}
          <div className="mt-24 pt-20 border-t border-[#6D3D0D]/10">
            <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h3 className="font-serif text-[#6D3D0D]" style={{fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.01em'}}>
                What to <span className="text-[#D4AF37]">Expect</span>
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10 hover:border-[#D4AF37]/30 transition-all duration-300 group">
                <div className="text-[#D4AF37] font-serif text-3xl font-semibold mb-2 group-hover:scale-110 transition-transform duration-300">24hrs</div>
                <h4 className="text-[#6D3D0D] font-medium mb-2">Initial Response</h4>
                <p className="text-[#6D3D0D]/60 text-sm font-light">Personal consultation booking confirmation</p>
              </div>
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10 hover:border-[#D4AF37]/30 transition-all duration-300 group">
                <div className="text-[#D4AF37] font-serif text-3xl font-semibold mb-2 group-hover:scale-110 transition-transform duration-300">1-2 wks</div>
                <h4 className="text-[#6D3D0D] font-medium mb-2">Design Phase</h4>
                <p className="text-[#6D3D0D]/60 text-sm font-light">Detailed sketches and 3D renderings</p>
              </div>
              <div className="text-center p-6 bg-[#FAF7F2] border border-[#6D3D0D]/10 hover:border-[#D4AF37]/30 transition-all duration-300 group">
                <div className="text-[#D4AF37] font-serif text-3xl font-semibold mb-2 group-hover:scale-110 transition-transform duration-300">6-8 wks</div>
                <h4 className="text-[#6D3D0D] font-medium mb-2">Craftsmanship</h4>
                <p className="text-[#6D3D0D]/60 text-sm font-light">Meticulous handcrafting and finishing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION - Enhanced ========== */}
      <section className="py-24 lg:py-32 bg-[#FAF7F2]" ref={testimonialsRef}>
        <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Client Stories</span>
            <h2 className="font-serif text-[#6D3D0D] mt-4 mb-4" style={{fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>
              Treasured <span className="text-[#D4AF37]">Moments</span>
            </h2>
            <p className="text-[#6D3D0D]/70 font-light max-w-xl mx-auto">
              Every piece we create carries a story. Here are some of our favorites.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white border border-[#6D3D0D]/10 p-10 lg:p-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 hover:shadow-xl hover:border-[#D4AF37]/20 group">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <div className="text-4xl text-[#D4AF37] font-serif mb-4 opacity-50">&quot;</div>
              <p className="text-[#6D3D0D]/75 font-light leading-relaxed mb-6 italic" style={{fontSize: 'clamp(1rem, 1.6vw, 1.1rem)'}}>
                The entire bespoke process was magical. From the initial consultation to the final reveal, every detail was perfect. Our 2.5ct cushion halo engagement ring exceeded every expectation – it&apos;s truly one-of-a-kind.
              </p>
              
              <div className="flex items-center gap-4">
                {/* Styled Initials Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6D3D0D] to-[#8B5A3C] flex items-center justify-center text-white font-serif text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                  C&J
                </div>
                <div>
                  <p className="font-medium text-[#6D3D0D]">Charlotte & James</p>
                  <p className="text-sm text-[#6D3D0D]/60 font-light">Engagement Ring • London</p>
                </div>
              </div>
              
              {/* Would Recommend Badge */}
              <div className="mt-6 pt-6 border-t border-[#6D3D0D]/10">
                <div className="flex items-center gap-2 text-sm text-[#6D3D0D]/60">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Would recommend to friends & family</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-[#6D3D0D]/10 p-10 lg:p-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 hover:shadow-xl hover:border-[#D4AF37]/20 group" style={{ transitionDelay: '150ms' }}>
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <div className="text-4xl text-[#D4AF37] font-serif mb-4 opacity-50">&quot;</div>
              <p className="text-[#6D3D0D]/75 font-light leading-relaxed mb-6 italic" style={{fontSize: 'clamp(1rem, 1.6vw, 1.1rem)'}}>
                Working with ELYSIUM to redesign my grandmother&apos;s vintage sapphire into a modern halo pendant was an emotional journey. They honored the legacy while creating something uniquely beautiful that I&apos;ll pass to my daughter.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6D3D0D] to-[#8B5A3C] flex items-center justify-center text-white font-serif text-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                  SM
                </div>
                <div>
                  <p className="font-medium text-[#6D3D0D]">Sarah Mitchell</p>
                  <p className="text-sm text-[#6D3D0D]/60 font-light">Heirloom Redesign • Edinburgh</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#6D3D0D]/10">
                <div className="flex items-center gap-2 text-sm text-[#6D3D0D]/60">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Would recommend to friends & family</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FORM SECTION - With Trust Badges ========== */}
      <section ref={formSectionRef} className="py-24 lg:py-32 bg-white scroll-mt-8" id="bespoke-form">
        <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16">
          {/* Form Section Header */}
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Start Your Journey</span>
            <h2 className="font-serif text-[#6D3D0D] mt-4 mb-4" style={{fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>
              Tell Us Your <span className="text-[#D4AF37]">Vision</span>
            </h2>
            <p className="text-[#6D3D0D]/70 font-light max-w-xl mx-auto mb-2">
              Share your dreams with us. There&apos;s no obligation – just the beginning of something beautiful.
            </p>
            {/* Time Estimate */}
            <p className="text-[#D4AF37] text-sm font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Takes only 3-4 minutes
            </p>
          </div>

          {/* Trust Badges - Near Form */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex items-center gap-2 text-sm text-[#6D3D0D]/70">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>GIA Certified Diamonds</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6D3D0D]/70">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span>25+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6D3D0D]/70">
              <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span>No Obligation Consultation</span>
            </div>
          </div>

          {/* The Form */}
          <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <BespokeForm />
          </div>
        </div>
      </section>

      {/* ========== INFO SECTION - Excellence & Atelier ========== */}
      <section className="py-20 lg:py-28 bg-[#FAF7F2]">
        <div className="max-w-[1900px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Excellence Card */}
            <div className="bg-white border border-[#6D3D0D]/10 p-8 lg:p-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 hover:shadow-lg hover:border-[#D4AF37]/20">
              <h3 className="font-serif text-[#6D3D0D] mb-6" style={{fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', letterSpacing: '-0.01em'}}>
                Uncompromising <span className="text-[#D4AF37]">Excellence</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-[#6D3D0D]/75 font-light leading-relaxed">Master artisans with over 25 years of experience</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-[#6D3D0D]/75 font-light leading-relaxed">Ethically sourced diamonds with GIA certification</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-[#6D3D0D]/75 font-light leading-relaxed">Hallmarked precious metals from certified suppliers</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2.5 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                  <p className="text-[#6D3D0D]/75 font-light leading-relaxed">Lifetime service and complimentary maintenance</p>
                </div>
              </div>
            </div>

            {/* Atelier Visit Card */}
            <div className="bg-gradient-to-br from-[#6D3D0D] to-[#8B5A3C] text-white p-8 lg:p-10 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 hover:shadow-lg" style={{ transitionDelay: '150ms' }}>
              <h3 className="font-serif mb-4" style={{fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', letterSpacing: '-0.01em'}}>
                Visit Our <span className="text-[#D4AF37]">Atelier</span>
              </h3>
              <p className="text-white/80 font-light leading-relaxed mb-6">
                Experience our bespoke service in person at our London showroom, or arrange a virtual consultation from anywhere in the world.
              </p>
              <div className="space-y-3 text-sm mb-8">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-white/80 font-light">London, United Kingdom</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/80 font-light">By appointment only</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-white/80 font-light">Virtual consultations available worldwide</span>
                </div>
              </div>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#D4AF37] text-[#6D3D0D] font-medium tracking-wider uppercase text-sm transition-all duration-300 hover:bg-white hover:gap-4 group"
              >
                <span>Book a Consultation</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========== FINAL CTA - Updated to be relevant ========== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <span className="text-[#6D3D0D]/50 text-xs uppercase tracking-[0.3em] font-light">Ready?</span>
          <h2 className="font-serif text-[#6D3D0D] mt-4 mb-6 leading-[0.95]">
            <span className="block font-light" style={{fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em'}}>Your Story Awaits</span>
            <span className="block font-semibold text-[#D4AF37]" style={{fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.04em'}}>Let&apos;s Begin</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[2px] w-16 bg-[#D4AF37]"></div>
            <div className="h-[2px] w-8 bg-[#D4AF37]/40"></div>
          </div>
          <p className="text-[#6D3D0D]/75 font-light leading-[1.8] mb-10 max-w-2xl mx-auto" style={{fontSize: 'clamp(1rem, 1.8vw, 1.2rem)'}}>
            Every masterpiece starts with a conversation. Share your vision, and let our artisans bring it to life.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center justify-center gap-4 px-12 py-5 bg-[#6D3D0D] text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 group relative overflow-hidden"
          >
            <span className="relative z-10">Start Your Bespoke Journey</span>
            <svg className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </div>
      </section>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        /* Animation classes - content visible by default for accessibility */
        .animate-on-scroll {
          transition: opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1), 
                      transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        /* Only apply initial hidden state when JS is available */
        @media (prefers-reduced-motion: no-preference) {
          .animate-on-scroll:not(.animate-revealed) {
            opacity: 0;
            transform: translateY(30px);
          }
        }
        
        .animate-on-scroll.animate-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </main>
  );
}
