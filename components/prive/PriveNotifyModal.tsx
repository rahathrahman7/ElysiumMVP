"use client";

import { useEffect, useState } from "react";

interface PriveNotifyModalProps {
  onClose: () => void;
}

export function PriveNotifyModal({ onClose }: PriveNotifyModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "prive-collection",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setIsSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prive-notify-title"
    >
      <div
        className="absolute inset-0 bg-[#6D3D0D]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-[#FAF7F2] max-w-md w-full shadow-2xl p-8 md:p-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#6D3D0D]/5 hover:bg-[#6D3D0D]/10 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-[#6D3D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="text-center">
            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium">
              You&apos;re on the list
            </span>
            <h2
              id="prive-notify-title"
              className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-4 mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              We&apos;ll be in <span className="text-[#D4AF37]">touch</span>
            </h2>
            <p className="text-[#6D3D0D]/70 text-sm leading-relaxed mb-8">
              Thank you. You&apos;ll be among the first to know when Privé Collection launches.
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium">
              Privé Collection
            </span>
            <h2
              id="prive-notify-title"
              className="font-serif text-[#6D3D0D] text-2xl md:text-3xl mt-4 mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              Be the first to <span className="text-[#D4AF37]">know</span>
            </h2>
            <p className="text-[#6D3D0D]/70 text-sm leading-relaxed mb-8">
              Enter your email and we&apos;ll notify you when our exclusive collection arrives.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prive-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="prive-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-[#6D3D0D]/20 bg-white text-[#6D3D0D] placeholder:text-[#6D3D0D]/40 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-[#6D3D0D] text-white font-light tracking-wider uppercase text-sm transition-all duration-300 hover:bg-[#D4AF37] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Notify Me"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
