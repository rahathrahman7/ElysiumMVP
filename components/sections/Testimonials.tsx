"use client";
import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  ringPurchased: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Charlotte W.",
    location: "London",
    text: "The Seraphina solitaire is absolutely breathtaking. The craftsmanship is exquisite and the six-claw setting makes the diamond appear even more brilliant. Could not be happier with my choice.",
    rating: 5,
    ringPurchased: "Seraphina Signature Six-Claw",
    verified: true
  },
  {
    id: "2", 
    name: "James M.",
    location: "Edinburgh",
    text: "Proposed with the Luna Low-Set and she said yes! The hidden halo detail is stunning and the ring sits perfectly on her finger. The service from Elysium was exceptional throughout.",
    rating: 5,
    ringPurchased: "Luna Low-Set Solitaire",
    verified: true
  },
  {
    id: "3",
    name: "Sophia R.",
    location: "Bath",
    text: "The Orabella Toi et Moi represents our unique love story perfectly. The pear and radiant diamonds complement each other beautifully. This will be an heirloom for generations.",
    rating: 5,
    ringPurchased: "Orabella Toi et Moi",
    verified: true
  },
  {
    id: "4",
    name: "Alexander H.",
    location: "Cambridge",
    text: "Exceptional quality and attention to detail. The Aveline radiant solitaire exceeded all expectations. The hidden halo adds such elegance. Worth every penny.",
    rating: 5,
    ringPurchased: "Aveline Radiant Solitaire", 
    verified: true
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-gold fill-current' : 'text-gray-300'}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-ivory to-beige">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover why couples across the UK trust Elysium for their most precious moments
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial Display */}
          <div 
            className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-8 transition-all duration-500 transform"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Quote Mark */}
            <div className="absolute -top-4 left-8 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>

            {/* Verified Badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span className="text-xs font-medium text-green-700">Verified Purchase</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">{renderStars(testimonials[currentIndex].rating)}</div>
              <span className="text-sm text-gray-600 ml-2">5.0</span>
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6 font-light">
              "{testimonials[currentIndex].text}"
            </blockquote>

            {/* Customer Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-charcoal text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-gray-600 text-sm">
                  {testimonials[currentIndex].location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gold font-medium">
                  {testimonials[currentIndex].ringPurchased}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex items-center justify-center gap-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gold scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-gold mb-2">4.9/5</div>
            <div className="flex mb-2">{renderStars(5)}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-xs text-gray-500 mt-1">Based on 247+ reviews</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-gold mb-2">98%</div>
            <div className="text-sm text-gray-600 mb-2">Would Recommend</div>
            <div className="text-xs text-gray-500 mt-1">To friends & family</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-gold mb-2">1000+</div>
            <div className="text-sm text-gray-600 mb-2">Happy Couples</div>
            <div className="text-xs text-gray-500 mt-1">Rings delivered in 2024</div>
          </div>
        </div>
      </div>
    </section>
  );
}