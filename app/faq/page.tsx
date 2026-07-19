import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — ELYSIUM",
  description: "Frequently asked questions about ELYSIUM jewellery.",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl">
      <h1 className="font-serif text-3xl md:text-4xl text-elysium-charcoal mb-8">Frequently Asked Questions</h1>
      <p className="text-elysium-charcoal/80 leading-relaxed mb-6">
        <em>Client to provide final copy. This is a placeholder.</em>
      </p>
      <p className="text-elysium-charcoal/80 leading-relaxed">
        Common questions about ring sizing, metals, diamonds, care, and delivery. 
        Please contact us for specific enquiries.
      </p>
    </div>
  );
}
