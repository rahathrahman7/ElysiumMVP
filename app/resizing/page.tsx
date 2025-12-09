import Link from "next/link";

export const metadata = {
  title: "Complimentary Resizing | ELYSIUM London",
  description:
    "Discover how ELYSIUM delivers one complimentary ring resize with atelier finishing, insured shipping, and concierge support.",
};

const steps = [
  {
    title: "Request your resize",
    detail:
      "Complete the resize form with your order number, original ring size, and desired fit. Our concierge replies within one business day with a prepaid insured label and timing details.",
  },
  {
    title: "Send your ring securely",
    detail:
      "Place the ring in the original ELYSIUM box (or another rigid box), remove additional accessories, seal the parcel, and drop it off with the courier shown on your label. International clients receive customs-ready paperwork.",
  },
  {
    title: "Atelier craftsmanship",
    detail:
      "Your ring returns to the same London workshop where it was created. Goldsmiths adjust the size, re-polish, ultrasonic clean, and inspect every claw before it leaves the bench.",
  },
  {
    title: "Return delivery",
    detail:
      "We dispatch your ring via overnight service in the UK (3–5 business days worldwide). Tracking is shared instantly and delivery always requires a signature for peace of mind.",
  },
];

const carePoints = [
  {
    title: "What's included",
    items: [
      "One complimentary resize within 12 months of delivery",
      "Adjustments up to ±2 UK sizes (beyond this we recommend a remake)",
      "Polish, clean, and prong check with every resize",
      "Resizing must be completed by ELYSIUM; third-party alterations void this service",
    ],
  },
  {
    title: "When to consider a remake",
    items: [
      "Full eternity bands",
      "Intricate pavé that would stretch past ±2 sizes",
      "Rings with continuous engraving",    
    ],
  },
  {
    title: "Logistics at a glance",
    items: [
      "Fully insured DHL Express labels for UK & international clients",
      "2–4 business day bench time once received",
      "Return shipping on us, always signature required",
    ],
  },
];

export default function ResizingPage() {
  return (
    <main className="bg-elysium-ivory text-elysium-charcoal">
      <section className="border-b border-elysium-whisper bg-gradient-to-b from-white to-elysium-ivory/70">
        <div className="container mx-auto px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-elysium-gold mb-4">Complimentary Service</p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.08em] mb-6">One Free Ring Resizing</h1>
          <p className="max-w-3xl mx-auto text-lg font-light leading-relaxed">
            Every ELYSIUM engagement ring includes a no-cost resize. The same artisans who crafted your piece perfect the fit with concierge logistics, insured shipping, and atelier-level finishing.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-white border border-elysium-whisper rounded-3xl p-8 shadow-sm">
              <div className="text-xs uppercase tracking-[0.3em] text-elysium-gold mb-3">Step {index + 1}</div>
              <h2 className="font-serif text-2xl mb-3">{step.title}</h2>
              <p className="text-base font-light leading-relaxed text-elysium-smoke">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-elysium-whisper/70">
        <div className="container mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
          {carePoints.map((point) => (
            <div key={point.title} className="p-8 bg-elysium-ivory rounded-3xl border border-elysium-whisper">
              <h3 className="font-serif text-xl mb-4">{point.title}</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-elysium-smoke">
                {point.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="block w-2 h-2 rounded-full bg-elysium-gold mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-3xl mb-4">Ready to resize?</h2>
        <p className="max-w-2xl mx-auto text-base font-light text-elysium-smoke mb-8">
          Submit a request and our concierge will send everything you need. You can also email <a href="mailto:concierge@elysium.london" className="text-elysium-gold underline">concierge@elysium.london</a> with your order number, current size, desired size, and preferred collection address.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-8 py-3 rounded-full border border-elysium-gold text-elysium-brown hover:bg-elysium-gold hover:text-elysium-brown transition"
          >
            Contact Concierge
          </Link>
          <Link
            href="/faq"
            className="px-8 py-3 rounded-full border border-elysium-whisper text-elysium-smoke hover:text-elysium-brown transition"
          >
            View Aftercare FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}
