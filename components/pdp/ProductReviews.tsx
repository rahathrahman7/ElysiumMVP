"use client";
import { useState } from "react";

interface Review {
  id: string;
  name: string;
  initials: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  ringSize?: string;
  metal?: string;
}

interface ProductReviewsProps {
  productSlug: string;
  className?: string;
}

// Mock reviews data - would typically come from an API
const getReviewsForProduct = (slug: string): Review[] => {
  const allReviews: Record<string, Review[]> = {
    "seraphina-signature-six-claw": [
      {
        id: "1",
        name: "Charlotte W.",
        initials: "CW",
        location: "London",
        rating: 5,
        text: "Absolutely stunning ring! The six-claw setting makes the diamond look even more brilliant. The craftsmanship is impeccable and the ring feels so luxurious. My fiancé chose perfectly.",
        date: "2024-02-15",
        verified: true,
        helpful: 12,
        ringSize: "L",
        metal: "18k White Gold"
      },
      {
        id: "2", 
        name: "Emma S.",
        initials: "ES",
        location: "Manchester",
        rating: 5,
        text: "I was initially worried about ordering such an important piece online, but the quality exceeded all expectations. The pavé band is so delicate and beautiful.",
        date: "2024-01-28",
        verified: true,
        helpful: 8,
        ringSize: "M",
        metal: "18k Rose Gold"
      }
    ],
    "luna-low-set-solitaire": [
      {
        id: "3",
        name: "James M.",
        initials: "JM", 
        location: "Edinburgh",
        rating: 5,
        text: "Perfect for an active lifestyle! The low setting means it doesn't catch on things but still looks elegant. The hidden halo adds such a nice touch of sparkle.",
        date: "2024-03-02",
        verified: true,
        helpful: 15,
        ringSize: "K",
        metal: "18k White Gold"
      }
    ]
  };

  return allReviews[slug] || [];
};

export default function ProductReviews({ productSlug, className = "" }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "helpful">("newest");
  
  let reviews = getReviewsForProduct(productSlug);
  
  if (!reviews.length) {
    return null;
  }

  // Sort reviews
  reviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "helpful":
        return b.helpful - a.helpful;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const displayReviews = showAll ? reviews : reviews.slice(0, 2);
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const sizeClasses = size === "lg" ? "w-5 h-5" : "w-4 h-4";
    return Array.from({ length: 5 }, (_, i) => (
      <svg 
        key={i} 
        className={`${sizeClasses} ${i < rating ? 'text-gold fill-current' : 'text-gray-300'}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className={`mt-16 pt-12 border-t border-neutral-200 ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-serif text-2xl text-charcoal mb-2">Customer Reviews</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating), "lg")}
              <span className="ml-2 text-lg font-medium text-charcoal">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">
              ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      <div className="space-y-6">
        {displayReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{review.initials}</span>
                </div>
                <div>
                  <div className="font-medium text-charcoal">{review.name}</div>
                  <div className="text-sm text-gray-600">{review.location}</div>
                </div>
              </div>
              
              {review.verified && (
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  <span className="text-xs font-medium text-green-700">Verified</span>
                </div>
              )}
            </div>

            {/* Rating & Date */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
            </div>

            {/* Review Text */}
            <p className="text-gray-800 leading-relaxed mb-4">{review.text}</p>

            {/* Purchase Details */}
            {(review.ringSize || review.metal) && (
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                {review.metal && <span>Metal: {review.metal}</span>}
                {review.ringSize && <span>Size: {review.ringSize}</span>}
              </div>
            )}

            {/* Helpful Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 10v12l4-2 4 2V10"/>
                  <path d="M7 10l4-7 4 7"/>
                </svg>
                Helpful ({review.helpful})
              </button>
              <div className="text-xs text-gray-500">
                Reviewed {formatDate(review.date)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {reviews.length > 2 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 rounded-lg font-medium"
          >
            {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}

      {/* Review CTA */}
      <div className="mt-8 p-6 bg-gradient-to-r from-ivory to-beige rounded-2xl text-center">
        <h4 className="font-serif text-xl text-charcoal mb-2">Share Your Experience</h4>
        <p className="text-gray-700 mb-4">Help other couples find their perfect ring</p>
        <button className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium">
          Write a Review
        </button>
      </div>
    </section>
  );
}