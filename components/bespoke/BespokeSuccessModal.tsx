"use client";
import { useEffect, useState } from "react";

interface BespokeSuccessModalProps {
  onClose: () => void;
}

// Sparkle particle component
function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <div 
      className="absolute w-2 h-2 pointer-events-none"
      style={style}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#D4AF37]">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    </div>
  );
}

export function BespokeSuccessModal({ onClose }: BespokeSuccessModalProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    // Trigger content animation
    setTimeout(() => setShowContent(true), 100);

    // Create sparkle particles
    const createSparkles = () => {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          transform: `scale(${0.5 + Math.random() * 1})`,
          opacity: 0,
          animation: `sparkle ${1.5 + Math.random() * 1}s ease-out ${Math.random() * 0.5}s forwards`,
        } as React.CSSProperties,
      }));
      setSparkles(newSparkles);
    };

    createSparkles();

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
    >
      {/* Backdrop with fade-in */}
      <div
        className="absolute inset-0 bg-[#6D3D0D]/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-[#FAF7F2] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-500 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Sparkle Container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} style={sparkle.style} />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#6D3D0D]/5 hover:bg-[#6D3D0D]/10 flex items-center justify-center transition-all duration-300 z-10 hover:rotate-90"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 text-[#6D3D0D]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8 md:p-12 lg:p-16 text-center relative">
          {/* Success Icon with pulse effect */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Pulse rings */}
            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-[#D4AF37]/30 rounded-full animate-ping animation-delay-200" />
            
            {/* Main icon */}
            <div className="relative w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 animate-scaleIn">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7"
                  className="animate-checkmark"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <h2
            id="success-title"
            className="font-serif text-[#6D3D0D] mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            Thank You for Your <span className="text-[#D4AF37]">Enquiry</span>
          </h2>

          <p
            className="text-[#6D3D0D]/75 font-light leading-relaxed mb-10 max-w-lg mx-auto"
            style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)" }}
          >
            We're thrilled to begin crafting your perfect piece. Your vision is in expert hands.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-[1px] w-16 bg-[#D4AF37]"></div>
            <div className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse"></div>
            <div className="h-[1px] w-16 bg-[#D4AF37]"></div>
          </div>

          {/* Timeline */}
          <div className="mb-12">
            <h3
              className="text-[#6D3D0D] font-serif mb-8 text-center"
              style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)", letterSpacing: "-0.01em" }}
            >
              What Happens <span className="text-[#D4AF37]">Next</span>
            </h3>

            <div className="space-y-6 text-left max-w-md mx-auto">
              {[
                {
                  time: "Within 24 Hours",
                  title: "Personal Response",
                  description:
                    "Our team will review your enquiry and send a personal response to schedule your consultation.",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  ),
                },
                {
                  time: "1-2 Weeks",
                  title: "Design Phase",
                  description:
                    "We'll collaborate on refining your vision, exploring options, and creating initial design concepts.",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  ),
                },
                {
                  time: "6-8 Weeks",
                  title: "Craftsmanship",
                  description:
                    "Our master artisans will handcraft your piece with meticulous attention to every detail.",
                  icon: (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                  ),
                },
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 opacity-0 animate-slideIn"
                  style={{ animationDelay: `${0.3 + index * 0.15}s` }}
                >
                  <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <div className="text-[#D4AF37]">{step.icon}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#D4AF37] text-xs uppercase tracking-wider font-medium">
                        {step.time}
                      </span>
                    </div>
                    <h4 className="text-[#6D3D0D] text-base font-medium mb-1">{step.title}</h4>
                    <p className="text-[#6D3D0D]/70 text-sm font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="/shop"
              className="inline-flex items-center justify-center gap-4 px-10 py-4 bg-[#6D3D0D] text-white font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#D4AF37] hover:gap-6 group relative overflow-hidden"
            >
              <span className="relative z-10">Browse Collection</span>
              <svg
                className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </a>

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-4 px-10 py-4 border-2 border-[#6D3D0D] text-[#6D3D0D] font-light tracking-[0.2em] uppercase text-sm transition-all duration-500 hover:bg-[#6D3D0D] hover:text-white"
            >
              <span>Close</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-[#6D3D0D]/50 text-xs font-light flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            A confirmation email has been sent to your inbox
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg) translateY(-20px);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }

        .animate-checkmark {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: checkmark 0.5s ease-out 0.4s forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
