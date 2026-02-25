"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface CategoryHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  breadcrumbs?: Breadcrumb[];
  compact?: boolean;
}

export default function CategoryHero({
  title,
  description,
  backgroundImage,
  breadcrumbs,
  compact = false,
}: CategoryHeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      setTimeout(() => {
        titleRef.current?.setAttribute('style', 'opacity:1;transform:translateY(0);');
      }, 100);
    }
    // Animate description
    if (descriptionRef.current) {
      setTimeout(() => {
        descriptionRef.current?.setAttribute('style', 'opacity:1;transform:translateY(0);');
      }, 200);
    }
  }, []);

  return (
    <header className={`relative ${compact ? 'py-16 md:py-20' : 'py-20 md:py-28'}`}>
      {/* Background Image or Gradient */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6D3D0D]/80 via-[#6D3D0D]/50 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F2] via-[#F5EFE6] to-[#E8E2DA]" />
      )}

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Link
                    href={crumb.href}
                    className={`transition-colors ${
                      backgroundImage 
                        ? 'text-white/70 hover:text-white' 
                        : 'text-[#6D3D0D]/60 hover:text-[#6D3D0D]'
                    }`}
                  >
                    {crumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <svg 
                      className={`w-4 h-4 ${backgroundImage ? 'text-white/40' : 'text-[#6D3D0D]/40'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <svg 
                  className={`w-4 h-4 ${backgroundImage ? 'text-white/40' : 'text-[#6D3D0D]/40'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className={backgroundImage ? 'text-white' : 'text-[#6D3D0D]'}>
                  {title}
                </span>
              </li>
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1
          ref={titleRef}
          className={`font-serif transition-all duration-700 ease-out ${
            backgroundImage ? 'text-white' : 'text-[#6D3D0D]'
          }`}
          style={{
            fontSize: compact ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(2.5rem, 5vw, 4rem)',
            letterSpacing: '-0.02em',
            opacity: 0,
            transform: 'translateY(20px)',
          }}
        >
          {title}
        </h1>

        {/* Decorative Line */}
        <div className="flex items-center gap-4 my-6">
          <div className={`h-[2px] w-16 ${backgroundImage ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]'}`} />
          <div className={`h-[2px] w-8 ${backgroundImage ? 'bg-[#D4AF37]/40' : 'bg-[#D4AF37]/40'}`} />
        </div>

        {/* Description */}
        <p
          ref={descriptionRef}
          className={`text-lg leading-relaxed max-w-2xl transition-all duration-700 ease-out delay-100 ${
            backgroundImage ? 'text-white/90' : 'text-[#6D3D0D]/70'
          }`}
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          {description}
        </p>
      </div>
    </header>
  );
}
